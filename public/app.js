_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  escape: /\{\{\{(.+?)\}\}\}/g
};

var View = Backbone.View.extend({
  el: 'div.model-view',
  className: 'col-sm-offset-4 col-sm-4',

  template: _.template($('#ModelViewTemplate').html()),

  render: function() {
    this.$el.html(this.template(_.defaults(this.model.attributes, {id: ''})));
    return this;
  },

  initialize: function(options) {
    this.model = options.model;
    this.listenTo(model, 'sync', this.render);
  },

  syncModelAttributes: function(event) {
      model.set(event.target.name, event.target.value);
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
    model.save({}, options);
  }

  // READ
  if ($button.hasClass('btn-success')) {
    model.fetch(options);
  }

  // UPDATE
  if ($button.hasClass('btn-warning')) {
    model.save({}, options);
  }

  // DELETE
  if ($button.hasClass('btn-danger')) {
    model.destroy(options);
  }
});


model.on('all', function() {
  console.debug('EVENT', arguments);
});

