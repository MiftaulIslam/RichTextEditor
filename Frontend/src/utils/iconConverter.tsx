
import { Bold, Italic, Underline, Strikethrough, LinkIcon, ImageIcon, Text, Heading1, Heading2, Heading3,List,ListOrdered,Quote,Code } from "lucide-react";
const getIcon = (i: string, size: string): JSX.Element | null => {
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
        case 'text':
            return <Text className={size} />;
        case 'heading1':
            return <Heading1 className={size} />;
        case 'heading2':
            return <Heading2 className={size} />;
        case 'heading3':
            return <Heading3 className={size} />;
        case 'list':
            return <List className={size} />;
        case 'listOrdered':
            return <ListOrdered className={size} />;
        case 'quote':
            return <Quote className={size} />;
        case 'code':
            return <Code className={size} />;
        default: return null;
    }
};
export default getIcon;