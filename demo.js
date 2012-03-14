PersonModel = Backbone.Model.extend(
	{
		initialize: function() {}
	});
	
PeopleCollection = Backbone.Collection.extend(
	{
		model: PersonModel
	});
	
AddPersonView = ModalView.extend(
	{
		name: "AddPersonView",
		model: PersonModel,
		templateHtml:
			"<div class='modal-header'>Add a new person to the list</div>" +
			"<form>" +
                "<table class='compact'>" +
                    "<tr><td>" +
				        "<label for='name'>Name</label>" +
                        "</td><td>" +
				        "<input type='text' id='name' />" +
                    "</td></tr>" +
                    "<tr><td>" +
				        "<label for='email'>Email</label>" +
                        "</td><td>" +
				        "<input type='text' id='email' />" +
                    "</td></tr>" +
					"<tr><td>" +
				        "<label for='phone'>Phone</label>" +
                        "</td><td>" +
				        "<input type='text' id='phone' />" +
                    "</td></tr>" +
                    "<tr><td></td><td>" +
				        "<input id='addPersonButton' type='submit' value='Add person' />" +
                    "</td></tr>" +
                "</table>" +
			"</form>",
		initialize:
			function()
			{
				_.bindAll( this, "render");
				this.template = _.template( this.templateHtml);
				this.model.bind( "isValid", this.modelIsValid, this);
                this.model.bind( "isInvalid", this.modelIsInvalid, this);
			},
		events:
			{
				"submit form": "addPerson"
			},
		modelIsValid:
            function( model)
            {
				$("#addPersonButton").enable();
            },
        modelIsInvalid:
            function( model)
            {
				$("#addPersonButton").disable();
            },
		addPerson:
			function( event)
			{
				event.preventDefault();
				this.hideModal();
				_people.add(
					new PersonModel({
						name: $("#name").val(),
						email: $("#email").val(),
						phone: $("#phone").val()}));
			},
		render:
			function()
			{
				$(this.el).html( this.template());
				return this;
			}
	});

PersonItemView = Backbone.View.extend(
	{
		templateHtml:
            "<div><span>{{name}}</span><br /><em>{{email}}</em><br /><em>{{phone}}</em></div>",
		tagName: "li",
		initialize:
			function()
			{
				this.template = _.template( this.templateHtml);
			},
		render:
			function()
			{
				$(this.el).html( this.template( this.model.toJSON()));
				return this;
			}
	});

PeopleListView = Backbone.View.extend(
	{
		initialize:
			function()
			{
				this.collection.bind("add", this.renderNewPerson, this);
				this.collection.bind("remove", this.render, this);
			},
		render:
			function()
			{
				var people = [];
				this.collection.each(
					function( model)
					{
						var view = new PersonItemView( {model : model});
						people.push( view.render().el);
					});

				$(this.el).append( people);
				return this;
			},
		renderNewPerson:
			function( personModel)
			{
				var html = new PersonItemView( {model : personModel}).render().el;
				$(this.el).append( html);
			}
	});