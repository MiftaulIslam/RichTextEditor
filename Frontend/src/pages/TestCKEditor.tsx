

import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import 'ckeditor5/ckeditor5.css';
import { baloonToolbar, blockToolbar, headings, LICENSE_KEY, plugins, toolbarItems } from '@/widgets/editor/utils';
import { ClassicEditor } from 'ckeditor5';



export default function App() {
	const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const { editorConfig } = useMemo(() => {
		if (!isLayoutReady) {
			return {};
		}

		return {
			editorConfig: {
				toolbar: {
					items: toolbarItems,
					shouldNotGroupWhenFull: false
				},

				plugins: plugins,
				balloonToolbar: baloonToolbar,
				blockToolbar: blockToolbar,
				heading: {
					options: headings
				},
				image: {
					toolbar: [
						'toggleImageCaption',
						'imageTextAlternative',
						'|',
						'imageStyle:alignBlockLeft',
						'imageStyle:block',
						'imageStyle:alignBlockRight',
						'|',
						'resizeImage'
					],
					styles: {
						options: ['alignBlockLeft', 'block', 'alignBlockRight']
					}
				},
				initialData:
					'<h1>Start Writing here 🎉</h1>',
				licenseKey: LICENSE_KEY,
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				placeholder: 'Type or paste your content here!',
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
				}
			}
		};
	}, [isLayoutReady]);
	
	return (
		<div className='bg-gray-100'>
<div className="main-container">
			<div className="editor-container editor-container_inline-editor editor-container_include-block-toolbar " ref={editorContainerRef}>
				<div className="editor-container__editor shadow-lg rounded-md bg-white min-h-screen">
					<div ref={editorRef}>{editorConfig && <CKEditor editor={ClassicEditor} config={{...editorConfig}} />}</div>
				</div>
			</div>
		</div>
		</div>
	);
}
