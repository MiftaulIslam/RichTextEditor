import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
// import { base_url } from '@/static/data';
import useTokenStore from '@/store/TokenStore';
import { useHttp } from '@/hooks/useHttp';
// Type definitions
interface NotificationSender {
    name: string;
    avatar: string;
}

export interface INotification {
    id: string;
    recipient_id: string;
    sender_id: string;
    type: 'follow' | 'comment' | 'like' | 'article';
    title: string;
    content: string;
    url_to: string;
    is_read: boolean;
    highlight: boolean;
    created_at: string;
    sender: NotificationSender;
}

export interface NotificationGroup {
    category: string;
    count: number;
    items: INotification[];
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    notificationGroups: NotificationGroup[];
}

export default function Notification({ isOpen, onClose, notificationGroups }: NotificationDropdownProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const token = useTokenStore((state) => state.token);
    const queryClient = useQueryClient();

    const { sendRequest } = useHttp();


    const toggleCategory = (category: string) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="top-12 right-2 z-40 absolute border-gray-200 bg-white shadow-lg border rounded-md w-80"
        >
            {notificationGroups.length > 0 ? (
                <div className="py-2">
            {notificationGroups.map((group, index) => (
                <div key={index} className="relative">
                    <div
                        onClick={() => toggleCategory(group.category)}
                        className="flex justify-between items-center hover:bg-gray-50 px-4 py-2 text-gray-700 text-sm cursor-pointer"
                    >
                        <p className="flex items-start">
                            {group.category}
                            {group.count > 0 && (
                                <span className="inline-block bg-green-700 ml-2 rounded-full w-2 h-2"></span>
                            )}
                        </p>
                        {expandedCategory === group.category ? (
                            <X onClick={onClose} size={16} />
                        ) : (
                            <ArrowRight size={16} />
                        )}
                    </div>
                    <AnimatePresence>
                        {expandedCategory === group.category && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                {group.items.map((notification) => (
                                    <a
                                        key={notification.id}
                                        href={notification.url_to}
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            await sendRequest(`notifications/${notification.id}/read`, "PUT", null, {
                                                headers: {
                                                    Authorization: `Bearer ${token}`
                                                }
                                            });
                                            queryClient.invalidateQueries({ queryKey: ['notifications'] });
                                            window.location.href = notification.url_to;
                                        }}
                                        className={`block px-4 py-3 text-sm border-l-4 ${!notification.is_read
                                                ? 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                                                : 'bg-white border-transparent hover:bg-blue-100'
                                            } transition-colors duration-150`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <img
                                                src={notification.sender.avatar || "/placeholder.svg"}
                                                alt={notification.sender.name}
                                                className="rounded-full w-8 h-8"
                                            />
                                            <div>
                                                <span className="font-semibold">
                                                    {notification.sender.name}{' '}
                                                </span>
                                                <span className="text-gray-600">
                                                    {notification.content}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
        ) : (
            <div className="p-2 text-center">
                <h4 className="text-gray-500 text-sm">
                    There are no notifications right now.

                </h4>
            </div>
        )}

        </motion.div>
    );
}