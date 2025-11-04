// import React, { useState } from 'react';
// import { Comment, Avatar, Tooltip, Button,  Input } from 'antd';
// import { UserOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
// import moment from 'moment';
// import 'moment/locale/fr';

// moment.locale('fr');
// const { TextArea } = Input;

// const CommentComponent = () => {
//     const [liked, setLiked] = useState(false);
//     const [likes, setLikes] = useState(0);
//     const [replyVisible, setReplyVisible] = useState(false);
//     const [replies, setReplies] = useState([]);
//     const [replyContent, setReplyContent] = useState('');

//     const like = () => {
//         setLiked(!liked);
//         setLikes(liked ? likes - 1 : likes + 1);
//     };

//     const handleReply = () => {
//         setReplyVisible(!replyVisible);
//     };

//     const submitReply = () => {
//         if (replyContent.trim()) {
//             setReplies([...replies, { id: Date.now(), content: replyContent, author: 'Vous', datetime: moment() }]);
//             setReplyContent('');
//             setReplyVisible(false);
//         }
//     };

//     const actions = [
//         <Tooltip key="like" title="J'aime">
//             <span onClick={like}>
//                 {React.createElement(liked ? LikeOutlined : LikeOutlined, {
//                     style: { marginRight: 8 },
//                 })}
//                 <span>{likes}</span>
//             </span>
//         </Tooltip>,
//         <Tooltip key="reply" title="Répondre">
//             <span onClick={handleReply}>
//                 {React.createElement(MessageOutlined, {
//                     style: { marginRight: 8 },
//                 })}
//                 <span>Répondre</span>
//             </span>
//         </Tooltip>,
//     ];

//     return (
//         <div>
//             <Comment
//                 actions={actions}
//                 author={<span>Jean Dupont</span>}
//                 avatar={<Avatar icon={<UserOutlined />} />}
//                 content={
//                     <p>
//                         Voici un exemple de commentaire avec des actions. Vous pouvez aimer ou répondre à ce commentaire.
//                     </p>
//                 }
//                 datetime={
//                     <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
//                         <span>{moment().fromNow()}</span>
//                     </Tooltip>
//                 }
//             >
//                 {replies.map((reply) => (
//                     <Comment
//                         key={reply.id}
//                         author={<span>{reply.author}</span>}
//                         avatar={<Avatar icon={<UserOutlined />} />}
//                         content={<p>{reply.content}</p>}
//                         datetime={
//                             <Tooltip title={reply.datetime.format('YYYY-MM-DD HH:mm:ss')}>
//                                 <span>{reply.datetime.fromNow()}</span>
//                             </Tooltip>
//                         }
//                     />
//                 ))}
//                 {replyVisible && (
//                     <div style={{ marginTop: 16 }}>
//                         <TextArea
//                             rows={2}
//                             value={replyContent}
//                             onChange={(e) => setReplyContent(e.target.value)}
//                             placeholder="Écrivez une réponse..."
//                         />
//                         <Button
//                             type="primary"
//                             onClick={submitReply}
//                             style={{ marginTop: 8 }}
//                         >
//                             Publier la réponse
//                         </Button>
//                     </div>
//                 )}
//             </Comment>
//         </div>
//     );
// };

// export default CommentComponent;
import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import TextArea from 'antd/es/input/TextArea';
import { Button } from 'antd';

moment.locale('fr');

const CommentComponent = ({
    comment,
    authorName = "Utilisateur Anonyme",
    initialContent = "Aucun contenu.",
    avatarSrc = null,
    datetime = moment(),
    initialLikes = 0,
    onSubmitReply = (content) => console.log("Réponse soumise :", content)
}) => {

    console.log(comment);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [replyVisible, setReplyVisible] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replies, setReplies] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const replyInputRef = useRef(null);

    // Focus sur le champ de réponse quand il s'affiche
    useEffect(() => {
        if (replyVisible && replyInputRef.current) {
            replyInputRef.current.focus();
        }
    }, [replyVisible]);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };

    const handleReply = () => {
        setReplyVisible(!replyVisible);
    };

    const handleSubmitReply = (e) => {
        e.preventDefault();
        if (!replyContent.trim()) {
            alert("Veuillez entrer un contenu pour votre réponse.");
            return;
        }

        setSubmitting(true);
        try {
            const newReply = {
                id: Date.now(),
                author: "Vous",
                content: replyContent,
                datetime: moment(),
                avatar: avatarSrc || "https://randomuser.me/api/portraits/men/32.jpg"
            };

            setReplies([...replies, newReply]);
            setReplyContent('');
            onSubmitReply(replyContent);
        } finally {
            setSubmitting(false);
            setReplyVisible(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-4">
            {/* Commentaire principal */}
            <div className="flex items-start mb-4">
                {/* Avatar */}
                <div className="flex-shrink-0 mr-3">
                    <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={avatarSrc || "https://randomuser.me/api/portraits/men/32.jpg"}
                        alt={authorName}
                    />
                </div>

                {/* Contenu du commentaire */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <span className="font-semibold text-gray-900 dark:text-white">{authorName}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {/* {new Date()} */}
                        </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-3">{initialContent}</p>

                    {/* Actions */}
                    

                    {/* Formulaire de réponse */}
                    {replyVisible && (
                        <form onSubmit={handleSubmitReply} className="mt-4">
                            <textarea
                                ref={replyInputRef}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                rows="3"
                                placeholder="Écrivez votre réponse ici..."
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${submitting
                                        ? 'bg-blue-300 text-white cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >

                                    {submitting ? (
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        'Publier'
                                    )}
                                </button>
                            </div>

                           
                        </form>
                    )}

                    {/* Réponses */}
                    {replies.length > 0 && (
                        <div className="mt-4 ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                            {replies.map((reply) => (
                                <div key={reply.id} className="flex items-start mb-4">
                                    <div className="flex-shrink-0 mr-3">
                                        <img
                                            className="w-8 h-8 rounded-full object-cover"
                                            src={reply.avatar}
                                            alt={reply.author}
                                        />
                                    </div>
                                    <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{reply.author}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {reply.datetime.fromNow()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentComponent;
