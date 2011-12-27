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
			"<form>" +
				"<label for='personName'>Person's name</label>" +
				"<input type='text' id='personName' />" +
				"<input id='addPersonButton' type='submit' value='Add person' />" +
			"</form>",
		initialize:
			function()
			{
				_.bindAll( this, "render");
				this.template = _.template( this.templateHtml);
			},
		events:
			{
				"submit form": "addPerson"
			},
		addPerson:
			function( event)
			{
				event.preventDefault();
				this.hideModal();
				_people.add( new PersonModel({name: $("#personName").val()}));
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
            "<span>{{name}}</span>",
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