import { useEffect, useState } from 'react';
import {
    getContactMessages,
    markContactMessageAsRead,
    deleteContactMessage
} from '../services/api';
import Spinner from './ui/Spinner';
import Alert from './ui/Alert';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadMessages = () => {
        setLoading(true);

        getContactMessages()
            .then(setMessages)
            .catch(() => setError('Failed to load messages.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const handleRead = async (id) => {
        try {
            await markContactMessageAsRead(id);
            loadMessages();
        } catch {
            setError('Failed to mark message as read.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;

        try {
            await deleteContactMessage(id);
            loadMessages();
        } catch {
            setError('Failed to delete message.');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            {error && <Alert type="error">{error}</Alert>}

            {messages.length === 0 ? (
                <Alert type="info">No contact messages yet.</Alert>
            ) : (
                <div className="flex flex-col gap-4">
                    {messages.map(message => (
                        <div
                            key={message.idContactMessage}
                            className={`border p-5 ${
                                message.lu ? 'border-neutral-200 bg-white' : 'border-black bg-neutral-50'
                            }`}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-sm font-black uppercase tracking-widest">
                                            {message.subject}
                                        </h3>

                                        {!message.lu && (
                                            <span className="bg-black px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 text-sm font-bold">
                                        {message.fullName}
                                    </p>

                                    <a
                                        href={`mailto:${message.email}`}
                                        className="mt-1 block text-sm text-neutral-500 hover:text-black"
                                    >
                                        {message.email}
                                    </a>

                                    <p className="mt-1 text-xs text-neutral-400">
                                        {message.dateCreation
                                            ? new Date(message.dateCreation).toLocaleString()
                                            : ''}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {!message.lu && (
                                        <button
                                            onClick={() => handleRead(message.idContactMessage)}
                                            className="border border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white"
                                        >
                                            Mark Read
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(message.idContactMessage)}
                                        className="border border-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-neutral-700">
                                {message.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}