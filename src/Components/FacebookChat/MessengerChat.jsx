import { FacebookProvider, CustomChat } from 'react-facebook';

const MessengerChat = () => {
  return (
    <div>
      <FacebookProvider appId="7191655627592531" chatSupport>
        <CustomChat pageId="1645310045577712" minimized={true}/>
      </FacebookProvider>  
    </div>
  )
}

export default MessengerChat;

