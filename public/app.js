_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  escape: /\{\{\{(.+?)\}\}\}/g,
  evaluate: /<%([\s\S]+?)%>/g,
};

var View = Backbone.View.extend({
  el: 'div.model-view',
  className: 'col-sm-offset-4 col-sm-4',

  template: _.template($('#ModelViewTemplate').html()),

  render: function() {
    this.$el.html(this.template(_.defaults({}, this.model.attributes, {id: ''})));
    return this;
  },

  initialize: function(options) {
    this.model = options.model;
    this.listenTo(model, 'sync', this.render);
  },

  syncModelAttributes: function(event) {
    var name = event.target.name;
    var value = event.target.value;

    switch (name) {
    case 'name':
      break;
    case 'age':
      value = parseInt(event.target.value) || null;
      break;
    case 'enabled':
      value = event.target.checked;
      break;

    // TODO: I'm unsure how to properly unset the ID. Maybe Backbone is not even
    // designed for it. I've considered deleting, but null seems fine for now.
    // delete model.id;
    // delete model.attributes[model.idAttribute];
    case 'id':
      name = model.idAttribute;
      value = parseInt(event.target.value) || null;
      break;
    }

    model.set(name, value);
  },

  events: {
      'change input': 'syncModelAttributes',
      'keyup input': 'syncModelAttributes',
  },

});

var Model = Backbone.Model.extend({
  defaults: {
    name: '',
    age: 0,
    enabled: false,
  },

  sync: function() {
    console.debug('SYNC', arguments);
    return Backbone.sync.apply(this, arguments);
  },

  urlRoot: function() {
    var url = $('input#backend-url').val();
    return url.length !== 0? url: '/user';
  },

});

var model = new Model();
var view = new View({ model: model });
view.render();

$('button').on('click', function(e) {
  var options = {
    emulateHTTP: $('input.emulate-http:checked').length === 1,
    emulateJSON: $('input.emulate-json:checked').length === 1,
    patch:       $('input.use-http-patch:checked').length === 1,
  };

  var $button = $(e.target);

  // CREATE
  if ($button.hasClass('btn-primary')) {
    if (model.isNew()) {
      model.save({}, options);
    } else {
      alert('Can not CREATE a model with an ID. Clear it, or use UPDATE.');
    }
  }

  // READ
  if ($button.hasClass('btn-success')) {
    if (model.isNew()) {
      alert('Without ID, only a collection could be read. Set it to read that model.');
    } else {
      model.fetch(options);
    }
  }

  // UPDATE
  if ($button.hasClass('btn-warning')) {
    if (model.isNew()) {
      alert('Can not UPDATE a model without an ID. Set it, or use CREATE.');
    } else {
      model.save({}, options);
    }
  }

  // DELETE
  if ($button.hasClass('btn-danger')) {
    model.destroy(options);
  }
});


model.on('all', function() {
  console.debug('EVENT', arguments);
});

