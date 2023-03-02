import React from 'react';
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
interface ChatBlockProps {
    isAi: boolean;
    value: string;
    uniqueId: string;
}

const ChatBlock: React.FC<ChatBlockProps> = ({isAi, value, uniqueId}) => {

    return (
        <div className={`wrapper ${isAi && 'ai'}`}>
            <div className="chat">
                <div className="profile">
                    <img
                        src={isAi ? bot : user}
                        alt={isAi ? 'bot' : 'user'}
                    />
                </div>
                <div className="message" id={uniqueId}>
                    {value}
                </div>
            </div>
        </div>
    );
};

export default ChatBlock;