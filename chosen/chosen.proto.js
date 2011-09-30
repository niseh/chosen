// Chosen, a Select Box Enhancer for jQuery and Protoype
// by Patrick Filler for Harvest, http://getharvest.com
// 
// Version 0.9.4
// Full source at https://github.com/harvesthq/chosen
// Copyright (c) 2011 Harvest http://getharvest.com

// MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
// This file is generated by `cake build`, do not edit it by hand.
(function() {
  /*
  Chosen source: generate output using 'cake build'
  Copyright (c) 2011 by Harvest
  */  var Chosen, get_side_border_padding, root;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  root = this;
  Chosen = (function() {
    function Chosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      this.set_default_values();
      this.is_multiple = this.form_field.multiple;
      this.is_rtl = this.form_field.hasClassName("chzn-rtl");
      this.default_text_default = this.form_field.multiple ? "Select Some Options" : "Select an Option";
      this.set_up_html();
      this.register_observers();
      this.form_field.addClassName("chzn-done");
    }
    Chosen.prototype.set_default_values = function() {
      this.click_test_action = __bind(function(evt) {
        return this.test_active_click(evt);
      }, this);
      this.activate_action = __bind(function(evt) {
        return this.activate_field(evt);
      }, this);
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.result_single_selected = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.choices = 0;
      this.results_none_found = this.options.no_results_text || "No results match";
      this.single_temp = new Template('<a href="javascript:void(0)" class="chzn-single"><span>#{default}</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>');
      this.multi_temp = new Template('<ul class="chzn-choices"><li class="search-field"><input type="text" value="#{default}" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>');
      this.choice_temp = new Template('<li class="search-choice" id="#{id}"><span>#{choice}</span><a href="javascript:void(0)" class="search-choice-close" rel="#{position}"></a></li>');
      return this.no_results_temp = new Template('<li class="no-results">' + this.results_none_found + ' "<span>#{terms}</span>"</li>');
    };
    Chosen.prototype.set_up_html = function() {
      var base_template, container_props, dd_top, dd_width, sf_width;
      this.container_id = this.form_field.identify().replace(/(:|\.)/g, '_') + "_chzn";
      this.f_width = this.form_field.getStyle("width") ? parseInt(this.form_field.getStyle("width"), 10) : this.form_field.getWidth();
      container_props = {
        'id': this.container_id,
        'class': "chzn-container" + (this.is_rtl ? ' chzn-rtl' : ''),
        'style': 'width: ' + this.f_width + 'px'
      };
      this.default_text = this.form_field.readAttribute('data-placeholder') ? this.form_field.readAttribute('data-placeholder') : this.default_text_default;
      base_template = this.is_multiple ? new Element('div', container_props).update(this.multi_temp.evaluate({
        "default": this.default_text
      })) : new Element('div', container_props).update(this.single_temp.evaluate({
        "default": this.default_text
      }));
      this.form_field.hide().insert({
        after: base_template
      });
      this.container = $(this.container_id);
      this.container.addClassName("chzn-container-" + (this.is_multiple ? "multi" : "single"));
      if (!this.is_multiple && this.form_field.options.length <= this.disable_search_threshold) {
        this.container.addClassName("chzn-container-single-nosearch");
      }
      this.dropdown = this.container.down('div.chzn-drop');
      dd_top = this.container.getHeight();
      dd_width = this.f_width - get_side_border_padding(this.dropdown);
      this.dropdown.setStyle({
        "width": dd_width + "px",
        "top": dd_top + "px"
      });
      this.search_field = this.container.down('input');
      this.search_results = this.container.down('ul.chzn-results');
      this.search_field_scale();
      this.search_no_results = this.container.down('li.no-results');
      if (this.is_multiple) {
        this.search_choices = this.container.down('ul.chzn-choices');
        this.search_container = this.container.down('li.search-field');
      } else {
        this.search_container = this.container.down('div.chzn-search');
        this.selected_item = this.container.down('.chzn-single');
        sf_width = dd_width - get_side_border_padding(this.search_container) - get_side_border_padding(this.search_field);
        this.search_field.setStyle({
          "width": sf_width + "px"
        });
      }
      this.results_build();
      return this.set_tab_index();
    };
    Chosen.prototype.register_observers = function() {
      this.container.observe("mousedown", __bind(function(evt) {
        return this.container_mousedown(evt);
      }, this));
      this.container.observe("mouseup", __bind(function(evt) {
        return this.container_mouseup(evt);
      }, this));
      this.container.observe("mouseenter", __bind(function(evt) {
        return this.mouse_enter(evt);
      }, this));
      this.container.observe("mouseleave", __bind(function(evt) {
        return this.mouse_leave(evt);
      }, this));
      this.search_results.observe("mouseup", __bind(function(evt) {
        return this.search_results_mouseup(evt);
      }, this));
      this.search_results.observe("mouseover", __bind(function(evt) {
        return this.search_results_mouseover(evt);
      }, this));
      this.search_results.observe("mouseout", __bind(function(evt) {
        return this.search_results_mouseout(evt);
      }, this));
      this.form_field.observe("liszt:updated", __bind(function(evt) {
        return this.results_update_field(evt);
      }, this));
      this.search_field.observe("blur", __bind(function(evt) {
        return this.input_blur(evt);
      }, this));
      this.search_field.observe("keyup", __bind(function(evt) {
        return this.keyup_checker(evt);
      }, this));
      this.search_field.observe("keydown", __bind(function(evt) {
        return this.keydown_checker(evt);
      }, this));
      if (this.is_multiple) {
        this.search_choices.observe("click", __bind(function(evt) {
          return this.choices_click(evt);
        }, this));
        return this.search_field.observe("focus", __bind(function(evt) {
          return this.input_focus(evt);
        }, this));
      }
    };
    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field.disabled;
      if (this.is_disabled) {
        this.container.addClassName('chzn-disabled');
        this.search_field.disabled = true;
        if (!this.is_multiple) {
          this.selected_item.stopObserving("focus", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClassName('chzn-disabled');
        this.search_field.disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.observe("focus", this.activate_action);
        }
      }
    };
    Chosen.prototype.container_mousedown = function(evt) {
      var target_closelink;
      if (!this.is_disabled) {
        target_closelink = evt != null ? evt.target.hasClassName("search-choice-close") : false;
        if (evt && evt.type === "mousedown") {
          evt.stop();
        }
        if (!this.pending_destroy_click && !target_closelink) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.clear();
            }
            document.observe("click", this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (evt.target === this.selected_item || evt.target.up("a.chzn-single"))) {
            this.results_toggle();
          }
          return this.activate_field();
        } else {
          return this.pending_destroy_click = false;
        }
      }
    };
    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR") {
        return this.results_reset(evt);
      }
    };
    Chosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };
    Chosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };
    Chosen.prototype.input_focus = function(evt) {
      if (!this.active_field) {
        return setTimeout(this.container_mousedown.bind(this), 50);
      }
    };
    Chosen.prototype.input_blur = function(evt) {
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout(this.blur_test.bind(this), 100);
      }
    };
    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClassName("chzn-container-active")) {
        return this.close_field();
      }
    };
    Chosen.prototype.close_field = function() {
      document.stopObserving("click", this.click_test_action);
      if (!this.is_multiple) {
        this.selected_item.tabIndex = this.search_field.tabIndex;
        this.search_field.tabIndex = -1;
      }
      this.active_field = false;
      this.results_hide();
      this.container.removeClassName("chzn-container-active");
      this.winnow_results_clear();
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };
    Chosen.prototype.activate_field = function() {
      if (!this.is_multiple && !this.active_field) {
        this.search_field.tabIndex = this.selected_item.tabIndex;
        this.selected_item.tabIndex = -1;
      }
      this.container.addClassName("chzn-container-active");
      this.active_field = true;
      this.search_field.value = this.search_field.value;
      return this.search_field.focus();
    };
    Chosen.prototype.test_active_click = function(evt) {
      if (evt.target.up('#' + this.container_id)) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };
    Chosen.prototype.results_build = function() {
      var content, data, startTime, _i, _len, _ref;
      startTime = new Date();
      this.parsing = true;
      this.results_data = root.SelectParser.select_to_array(this.form_field);
      if (this.is_multiple && this.choices > 0) {
        this.search_choices.select("li.search-choice").invoke("remove");
        this.choices = 0;
      } else if (!this.is_multiple) {
        this.selected_item.down("span").update(this.default_text);
      }
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else if (!data.empty) {
          content += this.result_add_option(data);
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.selected_item.down("span").update(data.html);
            if (this.allow_single_deselect) {
              this.selected_item.down("span").insert({
                after: "<abbr class=\"search-choice-close\"></abbr>"
              });
            }
          }
        }
      }
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      this.search_results.update(content);
      return this.parsing = false;
    };
    Chosen.prototype.result_add_group = function(group) {
      if (!group.disabled) {
        group.dom_id = this.container_id + "_g_" + group.array_index;
        return '<li id="' + group.dom_id + '" class="group-result">' + group.label.escapeHTML() + '</li>';
      } else {
        return "";
      }
    };
    Chosen.prototype.result_add_option = function(option) {
      var classes, style;
      if (!option.disabled) {
        option.dom_id = this.container_id + "_o_" + option.array_index;
        classes = option.selected && this.is_multiple ? [] : ["active-result"];
        if (option.selected) {
          classes.push("result-selected");
        }
        if (option.group_array_index != null) {
          classes.push("group-option");
        }
        if (option.classes !== "") {
          classes.push(option.classes);
        }
        style = option.style.cssText !== "" ? " style=\"" + option.style + "\"" : "";
        return '<li id="' + option.dom_id + '" class="' + classes.join(' ') + '"' + style + '>' + option.html + '</li>';
      } else {
        return "";
      }
    };
    Chosen.prototype.results_update_field = function() {
      this.result_clear_highlight();
      this.result_single_selected = null;
      return this.results_build();
    };
    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      this.result_clear_highlight();
      this.result_highlight = el;
      this.result_highlight.addClassName("highlighted");
      maxHeight = parseInt(this.search_results.getStyle('maxHeight'), 10);
      visible_top = this.search_results.scrollTop;
      visible_bottom = maxHeight + visible_top;
      high_top = this.result_highlight.positionedOffset().top;
      high_bottom = high_top + this.result_highlight.getHeight();
      if (high_bottom >= visible_bottom) {
        return this.search_results.scrollTop = (high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0;
      } else if (high_top < visible_top) {
        return this.search_results.scrollTop = high_top;
      }
    };
    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClassName('highlighted');
      }
      return this.result_highlight = null;
    };
    Chosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };
    Chosen.prototype.results_show = function() {
      var dd_top;
      if (!this.is_multiple) {
        this.selected_item.addClassName('chzn-single-with-drop');
        if (this.result_single_selected) {
          this.result_do_highlight(this.result_single_selected);
        }
      }
      dd_top = this.is_multiple ? this.container.getHeight() : this.container.getHeight() - 1;
      this.dropdown.setStyle({
        "top": dd_top + "px",
        "left": 0
      });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.value = this.search_field.value;
      return this.winnow_results();
    };
    Chosen.prototype.results_hide = function() {
      if (!this.is_multiple) {
        this.selected_item.removeClassName('chzn-single-with-drop');
      }
      this.result_clear_highlight();
      this.dropdown.setStyle({
        "left": "-9000px"
      });
      return this.results_showing = false;
    };
    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        if (this.is_multiple) {
          return this.search_field.tabIndex = ti;
        } else {
          this.selected_item.tabIndex = ti;
          return this.search_field.tabIndex = -1;
        }
      }
    };
    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices < 1 && !this.active_field) {
        this.search_field.value = this.default_text;
        return this.search_field.addClassName("default");
      } else {
        this.search_field.value = "";
        return this.search_field.removeClassName("default");
      }
    };
    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = evt.target.hasClassName("active-result") ? evt.target : evt.target.up(".active-result");
      if (target) {
        this.result_highlight = target;
        return this.result_select(evt);
      }
    };
    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = evt.target.hasClassName("active-result") ? evt.target : evt.target.up(".active-result");
      if (target) {
        return this.result_do_highlight(target);
      }
    };
    Chosen.prototype.search_results_mouseout = function(evt) {
      if (evt.target.hasClassName('active-result') || evt.target.up('.active-result')) {
        return this.result_clear_highlight();
      }
    };
    Chosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (this.active_field && !(evt.target.hasClassName('search-choice') || evt.target.up('.search-choice')) && !this.results_showing) {
        return this.results_show();
      }
    };
    Chosen.prototype.choice_build = function(item) {
      var choice_id, link;
      choice_id = this.container_id + "_c_" + item.array_index;
      this.choices += 1;
      this.search_container.insert({
        before: this.choice_temp.evaluate({
          id: choice_id,
          choice: item.html,
          position: item.array_index
        })
      });
      link = $(choice_id).down('a');
      return link.observe("click", __bind(function(evt) {
        return this.choice_destroy_link_click(evt);
      }, this));
    };
    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      if (!this.is_disabled) {
        this.pending_destroy_click = true;
        return this.choice_destroy(evt.target);
      }
    };
    Chosen.prototype.choice_destroy = function(link) {
      this.choices -= 1;
      this.show_search_field_default();
      if (this.is_multiple && this.choices > 0 && this.search_field.value.length < 1) {
        this.results_hide();
      }
      this.result_deselect(link.readAttribute("rel"));
      return link.up('li').remove();
    };
    Chosen.prototype.results_reset = function(evt) {
      this.form_field.options[0].selected = true;
      this.selected_item.down("span").update(this.default_text);
      this.show_search_field_default();
      evt.target.remove();
      if (typeof Event.simulate === 'function') {
        this.form_field.simulate("change");
      }
      if (this.active_field) {
        return this.results_hide();
      }
    };
    Chosen.prototype.result_select = function(evt) {
      var high, item, position;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple) {
          this.result_deactivate(high);
        } else {
          this.search_results.descendants(".result-selected").invoke("removeClassName", "result-selected");
          this.result_single_selected = high;
        }
        high.addClassName("result-selected");
        position = high.id.substr(high.id.lastIndexOf("_") + 1);
        item = this.results_data[position];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.selected_item.down("span").update(item.html);
          if (this.allow_single_deselect) {
            this.selected_item.down("span").insert({
              after: "<abbr class=\"search-choice-close\"></abbr>"
            });
          }
        }
        if (!(evt.metaKey && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.value = "";
        if (typeof Event.simulate === 'function') {
          this.form_field.simulate("change");
        }
        return this.search_field_scale();
      }
    };
    Chosen.prototype.result_activate = function(el) {
      return el.addClassName("active-result");
    };
    Chosen.prototype.result_deactivate = function(el) {
      return el.removeClassName("active-result");
    };
    Chosen.prototype.result_deselect = function(pos) {
      var result, result_data;
      result_data = this.results_data[pos];
      result_data.selected = false;
      this.form_field.options[result_data.options_index].selected = false;
      result = $(this.container_id + "_o_" + pos);
      result.removeClassName("result-selected").addClassName("active-result").show();
      this.result_clear_highlight();
      this.winnow_results();
      if (typeof Event.simulate === 'function') {
        this.form_field.simulate("change");
      }
      return this.search_field_scale();
    };
    Chosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };
    Chosen.prototype.winnow_results = function() {
      var found, option, part, parts, regex, result_id, results, searchText, startTime, startpos, text, zregex, _i, _j, _len, _len2, _ref;
      startTime = new Date();
      this.no_results_clear();
      results = 0;
      searchText = this.search_field.value === this.default_text ? "" : this.search_field.value.strip().escapeHTML();
      regex = new RegExp('^' + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      zregex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (!option.disabled && !option.empty) {
          if (option.group) {
            $(option.dom_id).hide();
          } else if (!(this.is_multiple && option.selected)) {
            found = false;
            result_id = option.dom_id;
            if (regex.test(option.html)) {
              found = true;
              results += 1;
            } else if (option.html.indexOf(" ") >= 0 || option.html.indexOf("[") === 0) {
              parts = option.html.replace(/\[|\]/g, "").split(" ");
              if (parts.length) {
                for (_j = 0, _len2 = parts.length; _j < _len2; _j++) {
                  part = parts[_j];
                  if (regex.test(part)) {
                    found = true;
                    results += 1;
                  }
                }
              }
            }
            if (found) {
              if (searchText.length) {
                startpos = option.html.search(zregex);
                text = option.html.substr(0, startpos + searchText.length) + '</em>' + option.html.substr(startpos + searchText.length);
                text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              } else {
                text = option.html;
              }
              if ($(result_id).innerHTML !== text) {
                $(result_id).update(text);
              }
              this.result_activate($(result_id));
              if (option.group_array_index != null) {
                $(this.results_data[option.group_array_index].dom_id).show();
              }
            } else {
              if ($(result_id) === this.result_highlight) {
                this.result_clear_highlight();
              }
              this.result_deactivate($(result_id));
            }
          }
        }
      }
      if (results < 1 && searchText.length) {
        return this.no_results(searchText);
      } else {
        return this.winnow_results_set_highlight();
      }
    };
    Chosen.prototype.winnow_results_clear = function() {
      var li, lis, _i, _len, _results;
      this.search_field.clear();
      lis = this.search_results.select("li");
      _results = [];
      for (_i = 0, _len = lis.length; _i < _len; _i++) {
        li = lis[_i];
        _results.push(li.hasClassName("group-result") ? li.show() : !this.is_multiple || !li.hasClassName("result-selected") ? this.result_activate(li) : void 0);
      }
      return _results;
    };
    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high;
      if (!this.result_highlight) {
        if (!this.is_multiple) {
          do_high = this.search_results.down(".result-selected.active-result");
        }
        if (!(do_high != null)) {
          do_high = this.search_results.down(".active-result");
        }
        if (do_high != null) {
          return this.result_do_highlight(do_high);
        }
      }
    };
    Chosen.prototype.no_results = function(terms) {
      return this.search_results.insert(this.no_results_temp.evaluate({
        terms: terms
      }));
    };
    Chosen.prototype.no_results_clear = function() {
      var nr, _results;
      nr = null;
      _results = [];
      while (nr = this.search_results.down(".no-results")) {
        _results.push(nr.remove());
      }
      return _results;
    };
    Chosen.prototype.keydown_arrow = function() {
      var actives, nexts, sibs;
      actives = this.search_results.select("li.active-result");
      if (actives.length) {
        if (!this.result_highlight) {
          this.result_do_highlight(actives.first());
        } else if (this.results_showing) {
          sibs = this.result_highlight.nextSiblings();
          nexts = sibs.intersect(actives);
          if (nexts.length) {
            this.result_do_highlight(nexts.first());
          }
        }
        if (!this.results_showing) {
          return this.results_show();
        }
      }
    };
    Chosen.prototype.keyup_arrow = function() {
      var actives, prevs, sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        sibs = this.result_highlight.previousSiblings();
        actives = this.search_results.select("li.active-result");
        prevs = sibs.intersect(actives);
        if (prevs.length) {
          return this.result_do_highlight(prevs.first());
        } else {
          if (this.choices > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };
    Chosen.prototype.keydown_backstroke = function() {
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.down("a"));
        return this.clear_backstroke();
      } else {
        this.pending_backstroke = this.search_container.siblings("li.search-choice").last();
        return this.pending_backstroke.addClassName("search-choice-focus");
      }
    };
    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClassName("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };
    Chosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            return this.results_hide();
          }
          break;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };
    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          return this.backstroke_length = this.search_field.value.length;
        case 9:
          return this.mouse_on_container = false;
        case 13:
          return evt.preventDefault();
        case 38:
          evt.preventDefault();
          return this.keyup_arrow();
        case 40:
          return this.keydown_arrow();
      }
    };
    Chosen.prototype.search_field_scale = function() {
      var dd_top, div, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.getStyle(style) + ";";
        }
        div = new Element('div', {
          'style': style_block
        }).update(this.search_field.value.escapeHTML());
        document.body.appendChild(div);
        w = Element.measure(div, 'width') + 25;
        div.remove();
        if (w > this.f_width - 10) {
          w = this.f_width - 10;
        }
        this.search_field.setStyle({
          'width': w + 'px'
        });
        dd_top = this.container.getHeight();
        return this.dropdown.setStyle({
          "top": dd_top + "px"
        });
      }
    };
    return Chosen;
  })();
  root.Chosen = Chosen;
  if (Prototype.Browser.IE) {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
      Prototype.BrowserFeatures['Version'] = new Number(RegExp.$1);
    }
  }
  get_side_border_padding = function(elmt) {
    var layout, side_border_padding;
    layout = new Element.Layout(elmt);
    return side_border_padding = layout.get("border-left") + layout.get("border-right") + layout.get("padding-left") + layout.get("padding-right");
  };
  root.get_side_border_padding = get_side_border_padding;
}).call(this);
(function() {
  var SelectParser;
  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }
    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };
    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };
    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };
    return SelectParser;
  })();
  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };
  this.SelectParser = SelectParser;
}).call(this);
