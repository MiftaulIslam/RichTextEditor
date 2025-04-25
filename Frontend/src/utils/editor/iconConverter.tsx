
import { Bold, Italic, Underline, Strikethrough, LinkIcon, ImageIcon } from "lucide-react";
 const getIcon = (i: string, size:string): JSX.Element | null => {
    switch (i) {
        case 'bold':
            return <Bold className={size} />;
        case 'italic':
            return <Italic className={size} />;
        case 'underline':
            return <Underline className={size} />;
        case 'strike':
            return <Strikethrough className={size} />;
        case 'link':
            return <LinkIcon className={size} />;
        case 'imgIcon':
            return <ImageIcon className={size} />;
        default: return null;
    }
};
export default getIcon;