import { ID, Query , Role, Permission } from 'appwrite';
import React, { useEffect, useState } from 'react';
import Hedear from '../components/Hedear';
import client, { COLLECTION_ID_MESSAGES, DATABASE_ID, databases } from '../appwriteConfig';
import { useAuth } from '../utils/AuthContext';
const Room = () => {
    const {user} = useAuth()
    const [messages,setMessages] = useState([])
    const [messageBody,setMessageBody] = useState('')
    useEffect(() =>{
        getMessages()
       
        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {

            if(response.events.includes("databases.*.collections.*.documents.*.create")){
                console.log('A MESSAGE WAS CREATED')
                setMessages(prevState => [response.payload, ...prevState])
            }

            if(response.events.includes("databases.*.collections.*.documents.*.delete")){
                console.log('A MESSAGE WAS DELETED!!!')
                setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
            }
        });

        console.log('unsubscribe:', unsubscribe)
      
        return () => {
          unsubscribe();
        };
      }, []);

    const handleSubmit = async (e) =>{
        e.preventDefault()
        let payload = {
            user_id:user.$id,
            username:user.name,
            body:messageBody
        }
        
        let permissions = [

            Permission.write(Role.user(user.$id)),
        
        ]

        let response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            ID.unique(),
            payload,
            permissions
            

        )
        console.log('Created!',response)
        // setMessages(prevState => [response, ...messages])
        setMessageBody('')
    }

    
 
    const getMessages = async () => {
        const response = await databases.listDocuments(
             DATABASE_ID,
             COLLECTION_ID_MESSAGES,
            [
                Query.orderDesc('$createdAt'),
                // Query.limit(3)
            ]
            
            )
        console.log('RESPONSE:', response)
        setMessages(response.documents)
    }
    const deleteMessage = async (message_id) => {
         databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);
        // setMessages(prevState => messages.filter(message => message.$id !== message_id))
     } 
  return (
    <main className="container">
        <Hedear/>
        <div className='room-container'>
            
        <form onSubmit={handleSubmit} id="message--form" >
            <div>
                <textarea 
                    required 
                    maxLength="250"
                    placeholder="Say something..." 
                    onChange={(e) => {setMessageBody(e.target.value)}}
                    value={messageBody}
                    ></textarea>
            </div>

            <div className="send-btn--wrapper">
                <input className="btn btn--secondary" type="submit" value="send"/>
            </div>
        </form>
    <div>
      
        {messages.map(message =>
            <div key={message.$id} className="message--wrapper">
                <div className='message--header'>
                <p> 
                            {message?.username ? (
                                <span> {message?.username}</span>
                            ): (
                                'Anonymous user'
                            )}
                         
                            <small className="message-timestamp"> {new Date(message.$createdAt).toLocaleString()}</small>
                        </p>
                        {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                            <button className="delete--btn" onClick={() => {deleteMessage(message.$id)}}>dd</button> 
                            
                        )}
                    <small className='message-timestamp'>{new Date(message.$createdAt).toLocaleString()}</small>
                    <span className='delete--btn' onClick={() => { deleteMessage(message.$id) }}>
  <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
  </svg>
</span>

                </div>
                <div className='message--body'>
                    <span>{message.body}</span>
                </div>

            </div>
        )}
      
      </div>
    </div>
    </main>
  )
}

export default Room
