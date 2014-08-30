var View = Backbone.View.extend({
  el: 'div.model-view',
  className: 'col-sm-offset-4 col-sm-4',

  template: _.template($('#ModelViewTemplate').html()),

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  initialize: function(options) {
    this.model = options.model;
  },
});

var Model = Backbone.Model.extend({
  defaults: {
    name: '',
    age: 0,
    active: false,
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
  var $button = $(e.target);

  if ($button.hasClass('btn-primary')) {
    if (model.isNew()) {
      model.save();
    } else {
      alert('The model is not new, you can only UPDATE it.');
    }
  }

  if ($button.hasClass('btn-success')) {
    model.fetch();
  }

  if ($button.hasClass('btn-warning')) {
    if (model.isNew()) {
      alert('The model is new, you can only CREATE it.');
    } else {
      var patch = $('input[type=checkbox].use-patch:checked').length === 1;
      model.save({patch: patch});
    }
  }

  if ($button.hasClass('btn-danger')) {
    model.destroy();
  }
});
