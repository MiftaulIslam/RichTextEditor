
import {
	Alignment,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	BalloonToolbar,
	BlockQuote,
	BlockToolbar,
	Bold,
	Code,
	CodeBlock,
	Emoji,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontSize,
	Heading,
	Highlight,
	HorizontalLine,

	ImageBlock,
	ImageCaption,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	Italic,
	Link,
	LinkImage,
	List,
	MediaEmbed,
	Mention,
	Paragraph,
	PasteFromOffice,
	ShowBlocks,
	SimpleUploadAdapter,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableColumnResize,
	TableToolbar,
	TextTransformation,
	Underline
} from 'ckeditor5';




export const LICENSE_KEY = 'GPL'; 





export const plugins = 
                [
                    Alignment,
                    Autoformat,
                    AutoImage,
                    AutoLink,
                    Autosave,
                    BalloonToolbar,
                    BlockQuote,
                    BlockToolbar,
                    Bold,
                    Code,
                    CodeBlock,
                    Essentials,
                    FontBackgroundColor,
                    FontColor,
                    FontSize,
                    Heading,
                    Highlight,
                    HorizontalLine,
                    ImageBlock,
                    ImageCaption,
                    ImageInsert,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    Indent,
                    Italic,
                    Link,
                    Emoji,
                    Mention ,
                    LinkImage,
                    List,
                    MediaEmbed,
                    Paragraph,
                    PasteFromOffice,
                    ShowBlocks,
                    SimpleUploadAdapter,
                    SpecialCharacters,
                    SpecialCharactersArrows,
                    SpecialCharactersCurrency,
                    SpecialCharactersEssentials,
                    SpecialCharactersLatin,
                    SpecialCharactersMathematical,
                    SpecialCharactersText,
                    Strikethrough,
                    Subscript,
                    Superscript,
                    Table,
                    TableColumnResize,
                    TableToolbar,
                    TextTransformation,
                    Underline
                ]



export const baloonToolbar = [
    'fontColor',
    'bold', 
    'italic',
    'underline',
    'emoji',
    '|', 
    'code', 
    'blockQuote', 
    '|', 
    'link', 
    'insertImage', 
    '|', 
    'bulletedList', 
    'numberedList'
]

export const blockToolbar = [
    'fontColor',
    '|',
    'bold',
    'italic',
    'underline',
    '|',
    'link',
    'insertImage',
    'insertTable',
    '|',
    'bulletedList',
    'numberedList',
    'outdent',
    'indent'
]
export const toolbarItems = [
    'heading',
    '|',

    'bold',
    'italic',
    'underline',
    
    'alignment',
    'fontColor',
    '|',
    'specialCharacters',
    'horizontalLine',
    'code',
    'codeBlock',
    'blockQuote',
    '|',
    'link',
    'insertImage',
    'mediaEmbed',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    
    'outdent',
    'indent',
    '|',
    

    'strikethrough',
    'subscript',
    'superscript',

    'insertTable',

]
export const headings = [
    {
        model: 'heading1',
        view: 'h1',
        title: 'Heading 1',
        class: 'ck-heading_heading1'
    },
    {
        model: 'heading2',
        view: 'h2',
        title: 'Heading 2',
        class: 'ck-heading_heading2'
    },
    {
        model: 'heading3',
        view: 'h3',
        title: 'Heading 3',
        class: 'ck-heading_heading3'
    },
    
    {
        model: 'paragraph',
        title: 'Paragraph',
        class: 'ck-heading_paragraph'
    },
]