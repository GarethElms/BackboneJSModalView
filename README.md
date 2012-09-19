# Backbone.ModalDialog.js

A base class for your Backbone js views which provides a showModal() method. 

[See the demo page live in action on www.garethelms.org] (http://www.garethelms.org/demo/backbone-js-modal-dialog/demo.html)

## How to use it

Include [Backbone.ModalDialog.js](https://github.com/GarethElms/BackboneJSModalView/blob/master/Backbone.ModalDialog.js) in your html page. Make your Backbone view extend ModalView. Now you can call myView.render().showModal().

For example, let's create a view we want to appear in a modal dialog :

####
	AddPersonView = ModalView.extend( {
		name: "AddPersonView",
		model: PersonModel,
		templateHtml:
			"<div class='modal-header'>Add a new person to the list</div>" +
			"<form>" +
			etc...

At this point you don't have to use your view as a modal dialog, it's still a normal view as far as Backbone is concerned (ModalView extends Backbone.View) but now your view has the showModal() method available. You call it like this :

	var view = new AddPersonView();
	view.render().showModal();

## Options for showModal()
You can pass an options hash into showModal(). Here's an example with all the default options that are assumed if you don't pass any options in at all :

	view.render().showModal({
		x: null,
        y: null,
		fadeInDuration:150,
		fadeOutDuration:150,
		showCloseButton:true,
		bodyOverflowHidden:false,
		setFocusOnFirstFormControl:true,
		targetContainer: document.body,
		slideFromAbove: false,
		slideFromBelow: false,
		slideDistance: 150,
		closeImageUrl: "/resources/shared/images/close-modal.png",
		closeImageHoverUrl: "/resources/shared/images/close-modal-hover.png",
		css:
		{
			"border": "2px solid #111",
			"background-color": "#fff",
			"-webkit-box-shadow": "0px 0px 15px 4px rgba(0, 0, 0, 0.5)",
			"-moz-box-shadow": "0px 0px 15px 4px rgba(0, 0, 0, 0.5)",
			"box-shadow": "0px 0px 15px 4px rgba(0, 0, 0, 0.5)",
			"-webkit-border-radius": "10px",
			"-moz-border-radius": "10px",
			"border-radius": "10px"
		}});

### x
The default x is calculated to be the centre of the visible screen. You can override this with your own x value or by using css.left or css.right.

### y
The default y is calculated to be the centre of the visible screen. You can override this with your own y value or by using css.top or css.bottom.
		
### fadeInDuration
How long in miliseconds it takes for the modal dialog to fade into view.

### fadeOutDuration
How long in miliseconds it takes for the modal dialog to fade to nothing when closed.

### showCloseButton
The close button (see closeImageUrl) appear in the top right giving the user a traditional method of closing the dialog. Clicking outside of the dialog will also close it.

### bodyOverflowHidden
This is false by default. If this is true then the scroll bar is disabled and user won't be able to scroll the dialog out of view.

### setFocusOnFirstFormControl
The first form control will automatically be given focus.

### targetContainer
By default the modal dialog is appended to document.body and can be positioned absolutely (relative to document body) using the x and/or y options or the top/left/right/bottom css options. If you want to position the dialog relative to a container element then pass in the jquery object here. See the "Anchored to header (left)" example on the [demo page] (https://github.com/GarethElms/BackboneJSModalView/blob/master/demo.html).

### slideFromAbove
To have the dialog slide down from above set this to true.

### slideFromBelow
To have the dialog slide up from below set this to true.

### slideDistance
If you are using the slideFromAbove or slideFromBelow options then this is the number of pixels length of the slide.

### closeImageUrl
The url for the close icon.

### closeImageHoverUrl
The url for the close icon on hover.

### css
You can pass in any css you want to be applied to the modal dialog. See the [jQuery .css() docs] (http://api.jquery.com/css)

### showModalAtScrollPosition
Boolean; default is true. Determines whether the modal dialog is displayed so it is visible in a scrolled viewport (a sensible default), or is displayed at the top of the document where it might be invisible if the window has been scrolled down.

### permanentlyVisible
Boolean; default is false. This prevents the modal from being closed, effectively blocking the ui permanently. The same as setting backgroundClickClosesModal, pressingEscapeClosesModal and showCloseButton to false.

### backgroundClickClosesModal
Boolean; default is true. Clicking in the background outside of the modal will close the modal by default.

### pressingEscapeClosesModal
Boolean; default is true. Pressing the escape button will close the modal by default.

# Release notes

### v0.3.2
* Fix for mobile Safari click event on modal blanket. backgroundClickClosesModal now works on mobile Safari.

### v0.3.1
* Added option permanentlyVisible to prevent the modal window being closed.
* Added option backgroundClickClosesModal to control whether a mouse click in the background will close the modal (default is true).
* Added option pressingEscapeClosesModal to control whether pressing the escape button will close the modal (default is true).
* Placed the ModalDialog object in the Backbone namespace.

### v0.3
* Added option showModalAtScrollPosition (default true) to determine whether the modal dialog is displayed so it is visible in a scrolled viewport (a sensible default), or is displayed at the top of the document where it might be invisible if the window has been scrolled down.
* Fixed a problem where the opaque blanket div didn't cover the entire screen when the window was scrolled. The modal blanket div's height is recalculated every time a dialog is displayed (in case the window height has changed since last time).
* Added the recentre() function which you can call to recentre a modal dialog in case the content has changed. Useful if errors messages have been added for example. American's can use recenter().
* Improved how the positioning works.
* The showModal() function now returns this.
* Added validation to the demo using [Thomas Pederson's excellent backbone.validation.js](https://github.com/thedersen/backbone.validation).

### v0.2
* Added option to render the modal dialog into a given container element allowing relative absolute positioning.
* Added option to slide the modal dialog down from above or up from below.
* You can now provide an css properties to be applied to the modal dialog.
* Clicking on a jQuery ui calender control no longer causes the modal dialog to close.
* Improved the default position of the modal dialog to be more central.

### v0.1
* Initial release