!function(r) {
  var ExpandoLink = Backbone.View.extend({
    events: {
      'click .expando-button': 'toggleExpando',
      'click .open-expando': 'expand',
    },

    initialize: function() {
      this.$button = this.$el.find('.expando-button');
      this.$expando = this.$el.find('.expando');
      this.expanded = false;
      this.cachedHTML = this.$expando.data('cachedhtml');
      this.loaded = !!this.cachedHTML;
      this.id = this.$el.thing_id();
      $(document).on('hide_thing_' + this.id, function() {
        this.collapse();
      }.bind(this));
    },

    toggleExpando: function(e) {
      this.expanded ? this.collapse() : this.expand();
    },

    expand: function() {
      this.$button.addClass('expanded')
                  .removeClass('collapsed');
      this.expanded = true;

      if (!this.loaded) {
        $.request('expando', { link_id: this.id }, function(res) {
          var expandoHTML = $.unsafe(res);
          this.cachedHTML = expandoHTML;
          this.$expando.html(expandoHTML);
          this.loaded = true;
        }.bind(this), false, 'html', true);
      } else {
        this.$expando.html(this.cachedHTML);
      }

      this.$expando.show();
    },

    collapse: function() {
      this.$button.addClass('collapsed')
                  .removeClass('expanded');
      this.expanded = false;
      this.$expando.hide().empty();
    },
  });

  $(function() {
    var expandoThings = $('.expando-button').closest('.thing');

    expandoThings.each(function() {
      new ExpandoLink({ el: this });
    });
  });
}(r);
