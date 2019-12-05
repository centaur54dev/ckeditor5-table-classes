import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';

import defaultIcon 	from '../theme/icons/default.svg';


export default class TableClassesPlugin extends Plugin {

	static get requires() {
		return [ tableClassesMain ];
	}

	static get pluginName() {
		return 'TableClassesPlugin';
	}
}



export class tableClassesMain extends Plugin {

	init() {
		const editor = this.editor;
		const items  = editor.config.get(( 'TableClasses.items' ))
		
		for (let i=0; i<items.length; i++){
			const userid = this._safeGet(items[i].id, "");
			const comid = "tableclass-"+userid;
			const classes = this._safeGet(items[i].classes, "");
			if (userid==="" || classes==="") continue;	//disabled
			const icon = this._safeGet(items[i].icon, defaultIcon)

			//schema
			editor.model.schema.extend( 'table', { allowAttributes: comid } );

			//model-view conversion
			editor.conversion.attributeToAttribute( {
				model: {
					name: 'table',
					key: comid,
				},
				view: {
						name: 'figure',
						key: 'class',
						value: classes
				}
			} );

			//register command
			editor.commands.add( comid, new AttributeCommand( editor, comid ) );


			// Add code button to feature components.
			editor.ui.componentFactory.add( comid, locale => {
				const command = editor.commands.get( comid );
				const view = new ButtonView( locale );

				view.set( {
					label  :userid ,
					icon   :icon,
					tooltip:true
				} );

				view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

				// Execute command.
				this.listenTo( view, 'execute', () => editor.execute( comid ) );

				return view;
			});

		}//...next i
	}

	_safeGet(input, safeDefault){
		if( typeof input !== 'undefined' &&  (input || input===false || input===0) ){
			return input;
		}
		else{
			return safeDefault;
		}
	}
}