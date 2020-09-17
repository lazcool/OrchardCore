/*
** NOTE: This file is generated by Gulp and should not be edited directly!
** Any changes made directly to this file will be overwritten next time its asset group is processed by Gulp.
*/

/// jQuery helper to append text to a textarea or input.
jQuery.fn.extend({
  insertAtCaret: function insertAtCaret(myValue) {
    return this.each(function (i) {
      if (document.selection) {
        //For browsers like Internet Explorer
        this.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      } else if (this.selectionStart || this.selectionStart === "0") {
        //For browsers like Firefox and Webkit based
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      } else {
        this.value += myValue;
        this.focus();
      }
    });
  }
});
var shortcodeWrapperTemplate = "\n<div class=\"shortcode-modal-wrapper\"></div>\n";
var shortcodeBtnTemplate = "\n<button type=\"button\" class=\"shortcode-modal-btn btn btn-sm\">\n    <span class=\"icon-shortcode\"></span>\n</button>\n"; // Wraps each .shortcode-modal-input class with a wrapper, and attaches detaches the shortcode app as required.

$(function () {
  $('.shortcode-modal-input').each(function () {
    $(this).wrap(shortcodeWrapperTemplate);
    $(this).parent().append(shortcodeBtnTemplate);
  });
  $('.shortcode-modal-btn').on('click', function () {
    var input = $(this).siblings('.shortcode-modal-input');
    shortcodesApp.init(function (defaultValue) {
      input.insertAtCaret(defaultValue);
    });
  });
});
var shortcodesApp;

function initializeShortcodesApp(element) {
  if (element) {
    var elementId = element.id;
    shortcodesApp = new Vue({
      el: '#' + elementId,
      data: function data() {
        var shortcodes = JSON.parse(element.dataset.shortcodes || "[]");
        var categories = JSON.parse(element.dataset.categories || "[]");
        return {
          filter: '',
          allShortcodes: shortcodes,
          filteredShortcodes: shortcodes,
          categories: categories,
          defaultValue: ''
        };
      },
      watch: {
        filter: function filter(_filter) {
          if (_filter) {
            var lower = _filter.toLowerCase();

            this.filteredShortcodes = this.allShortcodes.filter(function (s) {
              return s.name.startsWith(lower);
            });
          } else {
            this.filteredShortcodes = this.allShortcodes;
          }
        }
      },
      methods: {
        init: function init(onClose) {
          if (onClose) {
            this.onClose = onClose;
          }

          this.selectedValue = '';
          $(this.$el).modal('show');
          var self = this;
          $(this.$el).on('shown.bs.modal', function (e) {
            self.$refs.filter.focus();
          });
        },
        onClose: function onClose(defaultValue) {
          return;
        },
        setCategory: function setCategory(category) {
          if (category) {
            this.filteredShortcodes = this.allShortcodes.filter(function (s) {
              return s.categories.some(function (c) {
                return c.toLowerCase() === category.toLowerCase();
              });
            });
          } else {
            this.filteredShortcodes = this.allShortcodes;
          }

          this.filter = '';
        },
        isVisible: function isVisible(name) {
          return this.filteredShortcodes.some(function (s) {
            return s.name === name;
          });
        },
        insertShortcode: function insertShortcode(defaultValue) {
          this.defaultValue = defaultValue;
          $(this.$el).modal('hide');
          this.onClose(this.defaultValue);
        }
      }
    });
    return shortcodesApp;
  }
} // initializes a code mirror editor with a shortcode modal.


function initializeCodeMirrorShortcodeWrapper(editor) {
  var codemirrorWrapper = editor.display.wrapper;
  $(codemirrorWrapper).wrap(shortcodeWrapperTemplate);
  $(codemirrorWrapper).parent().append(shortcodeBtnTemplate);
  $(codemirrorWrapper).siblings('.shortcode-modal-btn').on('click', function () {
    shortcodesApp.init(function (defaultValue) {
      editor.replaceSelection(defaultValue);
    });
  });
}