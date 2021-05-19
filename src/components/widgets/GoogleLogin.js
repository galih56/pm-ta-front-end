import React, { useState, useEffect,useContext } from 'react';
import UserContext from '../../context/UserContext';
import { gapi, loadAuth2 ,loadClientAuth2 } from 'gapi-script';

const GoogleLogin  = ({meeting}) => {
  const [user, setUser] = useState(null);
  
  useEffect(async () => {
    // gapi.load('client', getEvents)
    const setAuth2 = async () => {
      const auth2 = await loadAuth2(
        gapi,
        process.env.REACT_APP_GOOGLE_CLIENT_ID, 
        "https://www.googleapis.com/auth/calendar"
      )
      if (auth2.isSignedIn.get()) {
          updateUser(auth2.currentUser.get())
      } else {
          attachSignin(document.getElementById('google-calendar-button'), auth2);
      }
    }
    setAuth2();
    console.log('gapi : ',gapi)
  }, []);
  
  useEffect(() => {
    if (!user) {
      const setAuth2 = async () => {
        const auth2 = await loadAuth2(
          gapi, 
          process.env.REACT_APP_GOOGLE_CLIENT_ID, 
          "https://www.googleapis.com/auth/calendar"
        )
        attachSignin(document.getElementById('google-calendar-button'), auth2);
      }
      setAuth2();
    }
  }, [user])

  const updateUser = (currentUser) => {
    const name = currentUser.getBasicProfile().getName();
    const profileImg = currentUser.getBasicProfile().getImageUrl();
    setUser({
        name: name,
        profileImg: profileImg,
    });
  };

  const attachSignin = (element, auth2) => {
    auth2.attachClickHandler(element, {},
      (googleUser) => {
        console.log(googleUser);  
        // updateUser(googleUser);
          // const calendarId='tikustemankucing@gmail.com';
          // const eventId="4mm0gmsd0949ddr55d7tuntgok"; 
          //   gapi.client.request({
          //     path:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`
          //   }).execute((jsonResp,rawResp)=>{
          //     console.log({jsonResp});
          //   })
      }, (error) => {
    });
  };

  const signOut = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      setUser(null);
      console.log('User signed out.');
    });
  }

  if(user) {
    return (
      <div className="container">
        <button id="google-calendar-button">
          Connect with google calendar
        </button>
      </div>
    );
  }
}
export default GoogleLogin;
/*
gapi.client.request({
    path:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
    method:'POST',
    body:{
    calendarId:calendarId,
    resource: {
        start:{ dateTime : meeting.start, timeZone : 'Asia/Jakarta' },
        end:{ dateTime : meeting.end, timeZone :'Asia/Jakarta' },
        conferenceData: {
            createRequest: {
                conferenceSolutionKey: { type: "hangoutsMeet" },
                requestId: requestId
            }
        },
        summary : meeting.title,
        description : meeting.description
    }
}
}).execute((jsonResp,rawResp)=>{
    console.log({jsonResp});
})
*/



    /*
    useEffect(async () => {
        const setAuth2 = async () => {
            const auth2 = await loadAuth2(
                gapi,
                process.env.REACT_APP_GOOGLE_CLIENT_ID, 
                "https://www.googleapis.com/auth/calendar"
            )
            if (auth2.isSignedIn.get()) {
                updateUser(auth2.currentUser.get())
            } else {
                attachSignin(document.getElementById('google-calendar-button'), auth2);
            }
        }
        setAuth2();
      }, []);
        
    useEffect(() => {
        if (!user) {
            const setAuth2 = async () => {
                const auth2 = await loadAuth2(
                gapi, 
                process.env.REACT_APP_GOOGLE_CLIENT_ID, 
                "https://www.googleapis.com/auth/calendar"
                )
                attachSignin(document.getElementById('google-calendar-button'), auth2);
            }
            setAuth2();
        }
    }, [user])
   
    const attachSignin = (element, auth2) => {
        auth2.attachClickHandler(element, {},
          (googleUser) => {
            const email = googleUser.getBasicProfile().getEmail(); 
            if(email==global.state.email){
            }else{
                snackbar('Please use a valid email','warning')
            }
            // updateUser(googleUser);
              // const calendarId='tikustemankucing@gmail.com';
              // const eventId="4mm0gmsd0949ddr55d7tuntgok"; 
              //   gapi.client.request({
              //     path:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`
              //   }).execute((jsonResp,rawResp)=>{
              //     console.log({jsonResp});
              //   })
          }, (error) => {
        });
      };
    */