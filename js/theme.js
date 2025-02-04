(function($) {
        var $ = jQuery = $;
        let cc = {
            sections: []
        };
    
        function cartItem() {
            var newText = $(".site-control [data-cartDrawerValue] div").eq(0).text();
            $(".as-salomon__cartCount [data-cartItem]").text(newText)
        }
        theme.Shopify = {
            formatMoney: function(t, r) {
                function e(t2, r2) {
                    return t2 === void 0 ? r2 : t2
                }
    
                function a(t2, r2, a2, o2) {
                    if (r2 = e(r2, 2), a2 = e(a2, ","), o2 = e(o2, "."), isNaN(t2) || t2 == null) return 0;
                    t2 = (t2 / 100).toFixed(r2);
                    var n2 = t2.split(".");
                    return n2[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + a2) + (n2[1] ? o2 + n2[1] : "")
                }
                typeof t == "string" && (t = t.replace(".", ""));
                var o = "",
                    n = /\{\{\s*(\w+)\s*\}\}/,
                    i2 = r || this.money_format;
                switch (i2.match(n)[1]) {
                    case "amount":
                        o = a(t, 2);
                        break;
                    case "amount_no_decimals":
                        o = a(t, 0);
                        break;
                    case "amount_with_comma_separator":
                        o = a(t, 2, ".", ",");
                        break;
                    case "amount_with_space_separator":
                        o = a(t, 2, " ", ",");
                        break;
                    case "amount_with_period_and_space_separator":
                        o = a(t, 2, " ", ".");
                        break;
                    case "amount_no_decimals_with_comma_separator":
                        o = a(t, 0, ".", ",");
                        break;
                    case "amount_no_decimals_with_space_separator":
                        o = a(t, 0, " ", "");
                        break;
                    case "amount_with_apostrophe_separator":
                        o = a(t, 2, "'", ".");
                        break;
                    case "amount_with_decimal_separator":
                        o = a(t, 2, ".", ".")
                }
                return i2.replace(n, o)
            },
            formatImage: function(originalImageUrl, format) {
                return originalImageUrl ? originalImageUrl.replace(/^(.*)\.([^\.]*)$/g, "$1_" + format + ".$2") : ""
            },
            Image: {
                imageSize: function(t) {
                    var e = t.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
                    return e !== null ? e[1] : null
                },
                getSizedImageUrl: function(t, e) {
                    if (e == null) return t;
                    if (e == "master") return this.removeProtocol(t);
                    var o = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
                    if (o != null) {
                        var i2 = t.split(o[0]),
                            r = o[0];
                        return this.removeProtocol(i2[0] + "_" + e + r)
                    }
                    return null
                },
                removeProtocol: function(t) {
                    return t.replace(/http(s)?:/, "")
                }
            }
        };
        class ccComponent {
            constructor(name) {
                let cssSelector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : `.cc-${name}`;
                const _this = this;
                this.instances = [], $(document).on("cc:component:load", function(event, component, target) {
                    component === name && $(target).find(`${cssSelector}:not(.cc-initialized)`).each(function() {
                        _this.init(this)
                    })
                }), $(document).on("cc:component:unload", function(event, component, target) {
                    component === name && $(target).find(cssSelector).each(function() {
                        _this.destroy(this)
                    })
                }), $(cssSelector).each(function() {
                    _this.init(this)
                })
            }
            init(container) {
                $(container).addClass("cc-initialized")
            }
            destroy(container) {
                $(container).removeClass("cc-initialized")
            }
            registerInstance(container, instance) {
                this.instances.push({
                    container,
                    instance
                })
            }
            destroyInstance(container) {
                this.instances = this.instances.filter(item => {
                    if (item.container === container) return typeof item.instance.destroy == "function" && item.instance.destroy(), item.container !== container
                })
            }
        }
        theme.Sections = new function() {
            var _ = this;
            _._instances = [], _._deferredSectionTargets = [], _._sections = [], _._deferredLoadViewportExcess = 300, _._deferredWatcherRunning = !1, _.init = function() {
                $(document).on("shopify:section:load", function(e) {
                    var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
                    target && _.sectionLoad(target)
                }).on("shopify:section:unload", function(e) {
                    var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
                    target && _.sectionUnload(target)
                }).on("shopify:section:reorder", function(e) {
                    var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
                    target && _.sectionReorder(target)
                }), $(window).on("throttled-scroll.themeSectionDeferredLoader debouncedresize.themeSectionDeferredLoader", _._processDeferredSections), _._deferredWatcherRunning = !0
            }, _.register = function(type, section, options) {
                _._sections.push({
                    type,
                    section,
                    afterSectionLoadCallback: options ? options.afterLoad : null,
                    afterSectionUnloadCallback: options ? options.afterUnload : null
                }), $('[data-section-type="' + type + '"]').each(function() {
                    Shopify.designMode || options && options.deferredLoad === !1 || !_._deferredWatcherRunning ? _.sectionLoad(this) : _.sectionDeferredLoad(this, options)
                })
            }, _.sectionDeferredLoad = function(target, options) {
                _._deferredSectionTargets.push({
                    target,
                    deferredLoadViewportExcess: options && options.deferredLoadViewportExcess ? options.deferredLoadViewportExcess : _._deferredLoadViewportExcess
                }), _._processDeferredSections(!0)
            }, _._processDeferredSections = function(firstRunCheck) {
                if (_._deferredSectionTargets.length)
                    for (var viewportTop = $(window).scrollTop(), viewportBottom = viewportTop + $(window).height(), loopStart = firstRunCheck === !0 ? _._deferredSectionTargets.length - 1 : 0, i2 = loopStart; i2 < _._deferredSectionTargets.length; i2++) {
                        var target = _._deferredSectionTargets[i2].target,
                            viewportExcess = _._deferredSectionTargets[i2].deferredLoadViewportExcess,
                            sectionTop = $(target).offset().top - viewportExcess,
                            doLoad = sectionTop > viewportTop && sectionTop < viewportBottom;
                        if (!doLoad) {
                            var sectionBottom = sectionTop + $(target).outerHeight() + viewportExcess * 2;
                            doLoad = sectionBottom > viewportTop && sectionBottom < viewportBottom
                        }(doLoad || sectionTop < viewportTop && sectionBottom > viewportBottom) && (_.sectionLoad(target), _._deferredSectionTargets.splice(i2, 1), i2--)
                    }
                firstRunCheck !== !0 && _._deferredSectionTargets.length === 0 && (_._deferredWatcherRunning = !1, $(window).off(".themeSectionDeferredLoader"))
            }, _.sectionLoad = function(target) {
                var target = target,
                    sectionObj = _._sectionForTarget(target),
                    section = !1;
                if (sectionObj.section ? section = sectionObj.section : section = sectionObj, section !== !1) {
                    var instance = {
                        target,
                        section,
                        $shopifySectionContainer: $(target).closest(".shopify-section"),
                        thisContext: {
                            functions: section.functions,
                            registeredEventListeners: []
                        }
                    };
                    instance.thisContext.registerEventListener = _._registerEventListener.bind(instance.thisContext), _._instances.push(instance), $(target).data("components") && $(target).data("components").split(",").forEach(component => {
                        $(document).trigger("cc:component:load", [component, target])
                    }), _._callSectionWith(section, "onSectionLoad", target, instance.thisContext), _._callSectionWith(section, "afterSectionLoadCallback", target, instance.thisContext), section.onSectionSelect && instance.$shopifySectionContainer.on("shopify:section:select", function(e) {
                        _._callSectionWith(section, "onSectionSelect", e.target, instance.thisContext)
                    }), section.onSectionDeselect && instance.$shopifySectionContainer.on("shopify:section:deselect", function(e) {
                        _._callSectionWith(section, "onSectionDeselect", e.target, instance.thisContext)
                    }), section.onBlockSelect && $(target).on("shopify:block:select", function(e) {
                        _._callSectionWith(section, "onBlockSelect", e.target, instance.thisContext)
                    }), section.onBlockDeselect && $(target).on("shopify:block:deselect", function(e) {
                        _._callSectionWith(section, "onBlockDeselect", e.target, instance.thisContext)
                    })
                }
            }, _.sectionUnload = function(target) {
                for (var sectionObj = _._sectionForTarget(target), instanceIndex = -1, i2 = 0; i2 < _._instances.length; i2++) _._instances[i2].target == target && (instanceIndex = i2);
                if (instanceIndex > -1) {
                    var instance = _._instances[instanceIndex];
                    $(target).off("shopify:block:select shopify:block:deselect"), instance.$shopifySectionContainer.off("shopify:section:select shopify:section:deselect"), _._callSectionWith(instance.section, "onSectionUnload", target, instance.thisContext), _._unloadRegisteredEventListeners(instance.thisContext.registeredEventListeners), _._callSectionWith(sectionObj, "afterSectionUnloadCallback", target, instance.thisContext), _._instances.splice(instanceIndex), $(target).data("components") && $(target).data("components").split(",").forEach(component => {
                        $(document).trigger("cc:component:unload", [component, target])
                    })
                } else
                    for (var i2 = 0; i2 < _._deferredSectionTargets.length; i2++)
                        if (_._deferredSectionTargets[i2].target == target) {
                            _._deferredSectionTargets[i2].splice(i2, 1);
                            break
                        }
            }, _.sectionReorder = function(target) {
                for (var instanceIndex = -1, i2 = 0; i2 < _._instances.length; i2++) _._instances[i2].target == target && (instanceIndex = i2);
                if (instanceIndex > -1) {
                    var instance = _._instances[instanceIndex];
                    _._callSectionWith(instance.section, "onSectionReorder", target, instance.thisContext)
                }
            }, _._registerEventListener = function(element, eventType, callback) {
                element.addEventListener(eventType, callback), this.registeredEventListeners.push({
                    element,
                    eventType,
                    callback
                })
            }, _._unloadRegisteredEventListeners = function(registeredEventListeners) {
                registeredEventListeners.forEach(rel => {
                    rel.element.removeEventListener(rel.eventType, rel.callback)
                })
            }, _._callSectionWith = function(section, method, container, thisContext) {
                if (typeof section[method] == "function") try {
                    thisContext ? section[method].bind(thisContext)(container) : section[method](container)
                } catch (ex) {
                    const sectionType = container.dataset.sectionType;
                    console.warn(`Theme warning: '${method}' failed for section '${sectionType}'`), console.debug(container, ex)
                }
            }, _._themeSectionTargetFromShopifySectionTarget = function(target) {
                var $target = $("[data-section-type]:first", target);
                return $target.length > 0 ? $target[0] : !1
            }, _._sectionForTarget = function(target) {
                for (var type = $(target).attr("data-section-type"), i2 = 0; i2 < _._sections.length; i2++)
                    if (_._sections[i2].type == type) return _._sections[i2];
                return !1
            }, _._sectionAlreadyRegistered = function(type) {
                for (var i2 = 0; i2 < _._sections.length; i2++)
                    if (_._sections[i2].type == type) return !0;
                return !1
            }
        }, theme.scriptsLoaded = {}, theme.loadScriptOnce = function(src, callback, beforeRun, sync) {
            if (typeof theme.scriptsLoaded[src] > "u") {
                theme.scriptsLoaded[src] = [];
                var tag = document.createElement("script");
                tag.src = src, (sync || beforeRun) && (tag.async = !1), beforeRun && beforeRun(), typeof callback == "function" && (theme.scriptsLoaded[src].push(callback), tag.readyState ? tag.onreadystatechange = function() {
                    if (tag.readyState == "loaded" || tag.readyState == "complete") {
                        tag.onreadystatechange = null;
                        for (var i2 = 0; i2 < theme.scriptsLoaded[this].length; i2++) theme.scriptsLoaded[this][i2]();
                        theme.scriptsLoaded[this] = !0
                    }
                }.bind(src) : tag.onload = function() {
                    for (var i2 = 0; i2 < theme.scriptsLoaded[this].length; i2++) theme.scriptsLoaded[this][i2]();
                    theme.scriptsLoaded[this] = !0
                }.bind(src));
                var firstScriptTag = document.getElementsByTagName("script")[0];
                return firstScriptTag.parentNode.insertBefore(tag, firstScriptTag), !0
            } else if (typeof theme.scriptsLoaded[src] == "object" && typeof callback == "function") theme.scriptsLoaded[src].push(callback);
            else return typeof callback == "function" && callback(), !1
        }, theme.loadStyleOnce = function(src) {
            var srcWithoutProtocol = src.replace(/^https?:/, "");
            if (!document.querySelector('link[href="' + encodeURI(srcWithoutProtocol) + '"]')) {
                var tag = document.createElement("link");
                tag.href = srcWithoutProtocol, tag.rel = "stylesheet", tag.type = "text/css";
                var firstTag = document.getElementsByTagName("link")[0];
                firstTag.parentNode.insertBefore(tag, firstTag)
            }
        }, theme.Disclosure = function() {
            var selectors = {
                    disclosureList: "[data-disclosure-list]",
                    disclosureToggle: "[data-disclosure-toggle]",
                    disclosureInput: "[data-disclosure-input]",
                    disclosureOptions: "[data-disclosure-option]"
                },
                classes = {
                    listVisible: "disclosure-list--visible"
                };
    
            function Disclosure($disclosure) {
                this.$container = $disclosure, this.cache = {}, this._cacheSelectors(), this._connectOptions(), this._connectToggle(), this._onFocusOut()
            }
            return Disclosure.prototype = $.extend({}, Disclosure.prototype, {
                _cacheSelectors: function() {
                    this.cache = {
                        $disclosureList: this.$container.find(selectors.disclosureList),
                        $disclosureToggle: this.$container.find(selectors.disclosureToggle),
                        $disclosureInput: this.$container.find(selectors.disclosureInput),
                        $disclosureOptions: this.$container.find(selectors.disclosureOptions)
                    }
                },
                _connectToggle: function() {
                    this.cache.$disclosureToggle.on("click", function(evt) {
                        var ariaExpanded = $(evt.currentTarget).attr("aria-expanded") === "true";
                        $(evt.currentTarget).attr("aria-expanded", !ariaExpanded), this.cache.$disclosureList.toggleClass(classes.listVisible)
                    }.bind(this))
                },
                _connectOptions: function() {
                    this.cache.$disclosureOptions.on("click", function(evt) {
                        evt.preventDefault(), this._submitForm($(evt.currentTarget).data("value"))
                    }.bind(this))
                },
                _onFocusOut: function() {
                    this.cache.$disclosureToggle.on("focusout", function(evt) {
                        var disclosureLostFocus = this.$container.has(evt.relatedTarget).length === 0;
                        disclosureLostFocus && this._hideList()
                    }.bind(this)), this.cache.$disclosureList.on("focusout", function(evt) {
                        var childInFocus = $(evt.currentTarget).has(evt.relatedTarget).length > 0,
                            isVisible = this.cache.$disclosureList.hasClass(classes.listVisible);
                        isVisible && !childInFocus && this._hideList()
                    }.bind(this)), this.$container.on("keyup", function(evt) {
                        evt.which === 27 && (this._hideList(), this.cache.$disclosureToggle.focus())
                    }.bind(this)), this.bodyOnClick = function(evt) {
                        var isOption = this.$container.has(evt.target).length > 0,
                            isVisible = this.cache.$disclosureList.hasClass(classes.listVisible);
                        isVisible && !isOption && this._hideList()
                    }.bind(this), $("body").on("click", this.bodyOnClick)
                },
                _submitForm: function(value) {
                    this.cache.$disclosureInput.val(value), this.$container.parents("form").submit()
                },
                _hideList: function() {
                    this.cache.$disclosureList.removeClass(classes.listVisible), this.cache.$disclosureToggle.attr("aria-expanded", !1)
                },
                unload: function() {
                    $("body").off("click", this.bodyOnClick), this.cache.$disclosureOptions.off(), this.cache.$disclosureToggle.off(), this.cache.$disclosureList.off(), this.$container.off()
                }
            }), Disclosure
        }(), theme.showQuickPopup = function(message, $origin) {
            var $popup = $('<div class="simple-popup"/>'),
                offs = $origin.offset();
            $popup.html(message).css({
                left: offs.left,
                top: offs.top
            }).hide(), $("body").append($popup), $popup.css({
                marginTop: -$popup.outerHeight() - 10,
                marginLeft: -($popup.outerWidth() - $origin.outerWidth()) / 2
            }), $popup.fadeIn(200).delay(3500).fadeOut(400, function() {
                $(this).remove()
            })
        }, $.fn.sort = [].sort, $.fn.fadeOutAndRemove = function(speed, callback) {
            $(this).fadeOut(speed, function() {
                $(this).remove(), typeof callback == "function" && callback()
            })
        }, $.fn.clickyBoxes = function(prefix) {
            if (prefix == "destroy") $(this).off(".clickyboxes"), $(this).next(".clickyboxes").off(".clickyboxes");
            else return $(this).filter("select:not(.clickybox-replaced)").addClass("clickybox-replaced").each(function() {
                var prefix2 = prefix2 || $(this).attr("id"),
                    $optCont = $('<ul class="clickyboxes"/>').attr("id", "clickyboxes-" + prefix2).data("select", $(this)).insertAfter(this),
                    $label;
                $(this).is("[id]") ? $label = $('label[for="' + $(this).attr("id") + '"]') : $label = $(this).siblings("label"), $label.length > 0 && $optCont.addClass("options-" + removeDiacritics($label.text()).toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/-*$/, "")), $(this).find("option").each(function() {
                    $("<li/>").appendTo($optCont).append($('<a href="#"/>').attr("data-value", $(this).val()).html($(this).html()).addClass("opt--" + removeDiacritics($(this).text()).toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/-*$/, "")))
                }), setTimeout(function() {
                    $optCont.find("li a").each(function() {
                        var $a = $(this);
                        if ($a.hasClass("active") && $a.hasClass("unavailable")) {
                            document.querySelector("[data-buy-cart-btn]").classList.add("disabled-true");
                            let cartBuy = document.querySelector("[data-buy-now-empty-btn]");
                            cartBuy && cartBuy.classList.add("disabled-true");
                            let buyItNow = document.querySelector("[data-buy-now-cart]");
                            buyItNow && buyItNow.classList.add("disabled-true")
                        }
                    })
                }, 0), $(this).hide().addClass("replaced").on("change.clickyboxes keyup.clickyboxes", function() {
                    var val = $(this).val();
                    $optCont.find("a").removeClass("active").filter(function() {
                        return $(this).attr("data-value") == val
                    }).addClass("active")
                }).trigger("keyup"), $optCont.on("click.clickyboxes", "a", function() {
                    if (!$(this).hasClass("active")) {
                        var $clicky = $(this).closest(".clickyboxes");
                        $clicky.data("select").val($(this).data("value")).trigger("change"), $clicky.trigger("change"), document.dispatchEvent(new Event("UpdatedPriceWithQuantity"))
                    }
                    if ($(this).hasClass("active") && $(this).hasClass("unavailable")) {
                        document.querySelector("[data-buy-cart-btn]").classList.add("disabled-true");
                        let cartBuy = document.querySelector("[data-buy-now-empty-btn]");
                        cartBuy && cartBuy.classList.add("disabled-true");
                        let buyItNow = document.querySelector("[data-buy-now-cart]");
                        buyItNow && buyItNow.classList.add("disabled-true")
                    }
                    if ($(this).hasClass("active") && !$(this).hasClass("unavailable")) {
                        document.querySelector("[data-buy-cart-btn]").classList.remove("disabled-true");
                        let cartBuy = document.querySelector("[data-buy-now-empty-btn]");
                        cartBuy && cartBuy.classList.remove("disabled-true");
                        let buyItNow = document.querySelector("[data-buy-now-cart]");
                        buyItNow && buyItNow.classList.remove("disabled-true")
                    }
                    return !1
                })
            })
        }, $.scrollBarWidth = function() {
            var $temp = $("<div/>").css({
                    width: 100,
                    height: 100,
                    overflow: "scroll",
                    position: "absolute",
                    top: -9999
                }).prependTo("body"),
                w = $temp[0].offsetWidth - $temp[0].clientWidth;
            return $temp.remove(), w
        };
        var chevronDownIcon = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/><path d="M0-.75h24v24H0z" fill="none"/></svg>';
        $.fn.selectReplace = function(leaveLabel) {
                return $(this).filter("select:not(.replaced, .noreplace)").each(function() {
                    var $opts = $(this).find("option"),
                        initialText = $opts.filter(":selected").length > 0 ? $opts.filter(":selected").text() : $opts.first().text(),
                        $cont = $(this).addClass("replaced").wrap('<div class="pretty-select">').parent().addClass("id-" + $(this).attr("id")).append('<span class="text"><span class="value">' + initialText + "</span></span>" + chevronDownIcon);
                    if ($(this).attr("id")) {
                        var $label = $('label[for="' + $(this).attr("id") + '"]'),
                            $selectTD = $(this).closest("td"),
                            $labelTD = $label.closest("td");
                        if (!leaveLabel && ($selectTD.length == 0 || $labelTD.length == 0 || $selectTD[0] == $labelTD[0])) {
                            var $labelSpan = $('<span class="label">').html($label.html()).prependTo($cont.find(".text"));
                            $labelSpan.slice(-1) != ":" && $labelSpan.append(":"), $cont.find("select").attr("aria-label", $label.text()), $label.remove()
                        }
                    }
                }).on("change keyup", function() {
                    $(this).siblings(".text").find(".value").html($(this).find(":selected").html())
                })
            }, $.fn.ccHoverLine = function(opts) {
                $(this).each(function() {
                    const $this = $(this);
                    if (!$this.hasClass("cc-init")) {
                        let updateLine2 = function() {
                            let $link = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : $this.find('li a[aria-selected="true"], li a.active');
                            $link.length === 1 && $hoverLine.css({
                                width: "100%",
                                top: $link.position().top,
                                left: $link.position().left
                            })
                        };
                        var updateLine = updateLine2;
                        $this.append("<li class='cc-hover-line'></li>").addClass("cc-init");
                        const $hoverLine = $(this).find(".cc-hover-line");
                        opts && opts.lineCss && $hoverLine.css(opts.lineCss), updateLine2(), $(window).outerWidth() < 768 ? $(this).find("li").click(function() {
                            const $link = $(this).find("a");
                            $link.length === 1 && updateLine2($link)
                        }) : $(this).find("li").hover(function() {
                            const $link = $(this).find("a");
                            $link.length === 1 && updateLine2($link)
                        }, function() {
                            updateLine2()
                        }), $(window).on("debouncedresizewidth", function() {
                            updateLine2()
                        })
                    }
                })
            },
            function() {
                function throttle(callback, threshold) {
                    let debounceTimeoutId = -1,
                        tick = !1;
                    return function() {
                        clearTimeout(debounceTimeoutId), debounceTimeoutId = setTimeout(callback, threshold), tick || (callback.call(), tick = !0, setTimeout(function() {
                            tick = !1
                        }, threshold))
                    }
                }
                const scrollEvent = document.createEvent("Event");
                scrollEvent.initEvent("throttled-scroll", !0, !0), window.addEventListener("scroll", throttle(function() {
                    window.dispatchEvent(scrollEvent)
                }, 200))
            }(), theme.cartNoteMonitor = {
                load: function($notes) {
                    $notes.on("change.themeCartNoteMonitor paste.themeCartNoteMonitor keyup.themeCartNoteMonitor", function() {
                        theme.cartNoteMonitor.postUpdate($(this).val())
                    })
                },
                unload: function($notes) {
                    $notes.off(".themeCartNoteMonitor")
                },
                updateThrottleTimeoutId: -1,
                updateThrottleInterval: 500,
                postUpdate: function(val) {
                    clearTimeout(theme.cartNoteMonitor.updateThrottleTimeoutId), theme.cartNoteMonitor.updateThrottleTimeoutId = setTimeout(function() {
                        $.post(theme.routes.cart_url + "/update.js", {
                            note: val
                        }, function(data) {}, "json")
                    }, theme.cartNoteMonitor.updateThrottleInterval)
                }
            }, theme.debounce = function(func) {
                let wait = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 700,
                    immediate = arguments.length > 2 ? arguments[2] : void 0;
                var timeout;
                return function() {
                    var context = this,
                        args = arguments,
                        later = function() {
                            timeout = null, immediate || func.apply(context, args)
                        },
                        callNow = immediate && !timeout;
                    clearTimeout(timeout), timeout = setTimeout(later, wait), callNow && func.apply(context, args)
                }
            };
        class AccordionInstance {
            constructor(container) {
                this.accordion = container, this.itemClass = ".cc-accordion-item", this.titleClass = ".cc-accordion-item__title", this.panelClass = ".cc-accordion-item__panel", this.allowMultiOpen = this.accordion.dataset.allowMultiOpen === "true", this.allowMultiOpen || (this.activeItem = this.accordion.querySelector(`${this.itemClass}[open]`)), this.bindEvents()
            }
            static addPanelHeight(panel) {
                panel.style.height = `${panel.scrollHeight}px`
            }
            static removePanelHeight(panel) {
                panel.getAttribute("style"), panel.removeAttribute("style")
            }
            open(item, panel) {
                if (panel.style.height = "0", item.open = !0, AccordionInstance.addPanelHeight(panel), setTimeout(() => {
                        item.classList.add("is-open")
                    }, 10), !this.allowMultiOpen) {
                    if (this.activeItem && this.activeItem !== item) {
                        const activePanel = this.activeItem.querySelector(this.panelClass);
                        this.close(this.activeItem, activePanel)
                    }
                    this.activeItem = item
                }
            }
            close(item, panel) {
                AccordionInstance.addPanelHeight(panel), item.classList.remove("is-open"), item.classList.add("is-closing"), this.activeItem === item && (this.activeItem = null), setTimeout(() => {
                    panel.style.height = "0"
                }, 10)
            }
            handleClick(e) {
                const toggle = e.target.closest(this.titleClass);
                if (!toggle) return;
                e.preventDefault();
                const item = toggle.parentNode,
                    panel = toggle.nextElementSibling;
                item.open ? this.close(item, panel) : this.open(item, panel)
            }
            handleTransition(e) {
                if (!e.target.matches(this.panelClass)) return;
                const panel = e.target,
                    item = panel.parentNode;
                item.classList.contains("is-closing") && (item.classList.remove("is-closing"), item.open = !1), AccordionInstance.removePanelHeight(panel)
            }
            bindEvents() {
                this.clickHandler = this.handleClick.bind(this), this.transitionHandler = this.handleTransition.bind(this), this.accordion.addEventListener("click", this.clickHandler), this.accordion.addEventListener("transitionend", this.transitionHandler)
            }
            destroy() {
                this.accordion.removeEventListener("click", this.clickHandler), this.accordion.removeEventListener("transitionend", this.transitionHandler)
            }
        }
        class Accordion extends ccComponent {
            constructor() {
                let name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "accordion",
                    cssSelector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : `.cc-${name}`;
                super(name, cssSelector)
            }
            init(container) {
                super.init(container), this.registerInstance(container, new AccordionInstance(container))
            }
            destroy(container) {
                this.destroyInstance(container), super.destroy(container)
            }
        }
        new Accordion, (() => {
            theme.initAnimateOnScroll = function() {
                if (document.body.classList.contains("cc-animate-enabled") && window.innerWidth >= 768) {
                    const animationTimeout = typeof document.body.dataset.ccAnimateTimeout < "u" ? document.body.dataset.ccAnimateTimeout : 200;
                    if ("IntersectionObserver" in window) {
                        const intersectionObserver = new IntersectionObserver((entries, observer) => {
                            entries.forEach(entry => {
                                entry.isIntersecting && !entry.target.classList.contains("cc-animate-complete") && (setTimeout(() => {
                                    entry.target.classList.add("-in", "cc-animate-complete")
                                }, animationTimeout), setTimeout(() => {
                                    entry.target.classList.remove("data-cc-animate"), entry.target.style.transitionDuration = null, entry.target.style.transitionDelay = null
                                }, 5e3), observer.unobserve(entry.target))
                            })
                        });
                        document.querySelectorAll("[data-cc-animate]:not(.cc-animate-init)").forEach(elem => {
                            elem.dataset.ccAnimateDelay && (elem.style.transitionDelay = elem.dataset.ccAnimateDelay), elem.dataset.ccAnimateDuration && (elem.style.transitionDuration = elem.dataset.ccAnimateDuration), elem.dataset.ccAnimate && elem.classList.add(elem.dataset.ccAnimate), elem.classList.add("cc-animate-init"), intersectionObserver.observe(elem)
                        })
                    } else {
                        const elems = document.querySelectorAll("[data-cc-animate]:not(.cc-animate-init)");
                        for (let i2 = 0; i2 < elems.length; i2++) elems[i2].classList.add("-in", "cc-animate-complete")
                    }
                }
            }, theme.initAnimateOnScroll(), document.addEventListener("shopify:section:load", () => {
                setTimeout(theme.initAnimateOnScroll, 100)
            });
            try {
                window.matchMedia("(min-width: 768px)").addEventListener("change", event => {
                    event.matches && setTimeout(theme.initAnimateOnScroll, 100)
                })
            } catch {}
        })();
        class GiftCardRecipient extends HTMLElement {
            constructor() {
                super(), this.recipientCheckbox = null, this.recipientFields = null, this.recipientEmail = null, this.recipientName = null, this.recipientMessage = null, this.recipientSendOn = null, this.recipientOffsetProperty = null
            }
            connectedCallback() {
                this.recipientEmail = this.querySelector('[name="properties[Recipient email]"]'), this.recipientEmailLabel = this.querySelector(`label[for="${this.recipientEmail.id}"]`), this.recipientName = this.querySelector('[name="properties[Recipient name]"]'), this.recipientMessage = this.querySelector('[name="properties[Message]"]'), this.recipientSendOn = this.querySelector('[name="properties[Send on]"]'), this.recipientOffsetProperty = this.querySelector('[name="properties[__shopify_offset]"]'), this.recipientEmailLabel && this.recipientEmailLabel.dataset.jsLabel && (this.recipientEmailLabel.innerText = this.recipientEmailLabel.dataset.jsLabel), this.recipientEmail.dataset.jsPlaceholder && (this.recipientEmail.placeholder = this.recipientEmail.dataset.jsPlaceholder, this.recipientEmail.ariaLabel = this.recipientEmail.dataset.jsAriaLabel), this.recipientOffsetProperty && (this.recipientOffsetProperty.value = new Date().getTimezoneOffset().toString(), this.recipientOffsetProperty.removeAttribute("disabled")), this.recipientCheckbox = this.querySelector(".cc-gift-card-recipient__checkbox"), this.recipientFields = this.querySelector(".cc-gift-card-recipient__fields"), this.recipientCheckbox.addEventListener("change", () => this.synchronizeProperties()), this.synchronizeProperties()
            }
            synchronizeProperties() {
                this.recipientCheckbox.checked ? (this.recipientFields.style.display = "block", this.recipientEmail.setAttribute("required", ""), this.recipientEmail.removeAttribute("disabled"), this.recipientName.removeAttribute("disabled"), this.recipientMessage.removeAttribute("disabled"), this.recipientSendOn.removeAttribute("disabled"), this.recipientOffsetProperty && this.recipientOffsetProperty.removeAttribute("disabled")) : (this.recipientFields.style.display = "none", this.recipientEmail.removeAttribute("required"), this.recipientEmail.setAttribute("disabled", ""), this.recipientName.setAttribute("disabled", ""), this.recipientMessage.setAttribute("disabled", ""), this.recipientSendOn.setAttribute("disabled", ""), this.recipientOffsetProperty && this.recipientOffsetProperty.setAttribute("disabled", ""))
            }
        }
        window.customElements.get("gift-card-recipient") || window.customElements.define("gift-card-recipient", GiftCardRecipient);
        class ccPopup {
            constructor($container, namespace) {
                this.$container = $container, this.namespace = namespace, this.cssClasses = {
                    visible: "cc-popup--visible",
                    bodyNoScroll: "cc-popup-no-scroll",
                    bodyNoScrollPadRight: "cc-popup-no-scroll-pad-right"
                }
            }
            open(callback) {
                if (this.$container.data("freeze-scroll")) {
                    clearTimeout(theme.ccPopupRemoveScrollFreezeTimeoutId), $("body").addClass(this.cssClasses.bodyNoScroll);
                    var scrollDiv = document.createElement("div");
                    scrollDiv.className = "popup-scrollbar-measure", document.body.appendChild(scrollDiv);
                    var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
                    document.body.removeChild(scrollDiv), scrollbarWidth > 0 && $("body").css("padding-right", scrollbarWidth + "px").addClass(this.cssClasses.bodyNoScrollPadRight)
                }
                this.$container.addClass(this.cssClasses.visible), this.previouslyActiveElement = document.activeElement, setTimeout(() => {
                    this.$container.find(".cc-popup-close")[0].focus()
                }, 500), $(window).on("keydown" + this.namespace, event => {
                    event.keyCode === 27 && this.close()
                }), callback && callback()
            }
            close(callback) {
                if (this.$container.removeClass(this.cssClasses.visible), this.previouslyActiveElement && $(this.previouslyActiveElement).focus(), $(window).off("keydown" + this.namespace), $("." + this.cssClasses.visible).filter(() => this.$container.data("freeze-scroll")).length === 0) {
                    let transitionDuration = 500;
                    const $innerModal = this.$container.find(".cc-popup-modal");
                    $innerModal.length && (transitionDuration = parseFloat(getComputedStyle($innerModal[0]).transitionDuration), transitionDuration && transitionDuration > 0 && (transitionDuration *= 1e3)), theme.ccPopupRemoveScrollFreezeTimeoutId = setTimeout(() => {
                        $("body").removeClass(this.cssClasses.bodyNoScroll).removeClass(this.cssClasses.bodyNoScrollPadRight).css("padding-right", "0")
                    }, transitionDuration)
                }
                callback && callback()
            }
        }
        class PriceRangeInstance {
            constructor(container) {
                this.container = container, this.selectors = {
                    inputMin: ".cc-price-range__input--min",
                    inputMax: ".cc-price-range__input--max",
                    control: ".cc-price-range__control",
                    controlMin: ".cc-price-range__control--min",
                    controlMax: ".cc-price-range__control--max",
                    bar: ".cc-price-range__bar",
                    activeBar: ".cc-price-range__bar-active"
                }, this.controls = {
                    min: {
                        barControl: container.querySelector(this.selectors.controlMin),
                        input: container.querySelector(this.selectors.inputMin)
                    },
                    max: {
                        barControl: container.querySelector(this.selectors.controlMax),
                        input: container.querySelector(this.selectors.inputMax)
                    }
                }, this.controls.min.value = parseInt(this.controls.min.input.value === "" ? this.controls.min.input.placeholder : this.controls.min.input.value), this.controls.max.value = parseInt(this.controls.max.input.value === "" ? this.controls.max.input.placeholder : this.controls.max.input.value), this.valueMin = this.controls.min.input.min, this.valueMax = this.controls.min.input.max, this.valueRange = this.valueMax - this.valueMin, [this.controls.min, this.controls.max].forEach(item => {
                    item.barControl.setAttribute("aria-valuemin", this.valueMin), item.barControl.setAttribute("aria-valuemax", this.valueMax), item.barControl.setAttribute("tabindex", 0)
                }), this.controls.min.barControl.setAttribute("aria-valuenow", this.controls.min.value), this.controls.max.barControl.setAttribute("aria-valuenow", this.controls.max.value), this.bar = container.querySelector(this.selectors.bar), this.activeBar = container.querySelector(this.selectors.activeBar), this.inDrag = !1, this.rtl = document.querySelector("html[dir=rtl]"), this.bindEvents(), this.render()
            }
            getPxToValueRatio() {
                const r = this.bar.clientWidth / (this.valueMax - this.valueMin);
                return this.rtl ? -r : r
            }
            getPcToValueRatio() {
                return 100 / (this.valueMax - this.valueMin)
            }
            setActiveControlValue(value) {
                isNaN(parseInt(value)) || (this.activeControl === this.controls.min ? (value === "" && (value = this.valueMin), value = Math.max(this.valueMin, value), value = Math.min(value, this.controls.max.value)) : (value === "" && (value = this.valueMax), value = Math.min(this.valueMax, value), value = Math.max(value, this.controls.min.value)), this.activeControl.value = Math.round(value), this.activeControl.input.value != this.activeControl.value && (this.activeControl.value == this.activeControl.input.placeholder ? this.activeControl.input.value = "" : this.activeControl.input.value = this.activeControl.value, this.activeControl.input.dispatchEvent(new CustomEvent("change", {
                    bubbles: !0,
                    cancelable: !1,
                    detail: {
                        sender: "theme:component:price_range"
                    }
                }))), this.activeControl.barControl.setAttribute("aria-valuenow", this.activeControl.value))
            }
            render() {
                this.drawControl(this.controls.min), this.drawControl(this.controls.max), this.drawActiveBar()
            }
            drawControl(control) {
                const x = (control.value - this.valueMin) * this.getPcToValueRatio() + "%";
                this.rtl ? control.barControl.style.right = x : control.barControl.style.left = x
            }
            drawActiveBar() {
                const s = (this.controls.min.value - this.valueMin) * this.getPcToValueRatio() + "%",
                    e = (this.valueMax - this.controls.max.value) * this.getPcToValueRatio() + "%";
                this.rtl ? (this.activeBar.style.left = e, this.activeBar.style.right = s) : (this.activeBar.style.left = s, this.activeBar.style.right = e)
            }
            handleControlTouchStart(e) {
                e.preventDefault(), this.startDrag(e.target, e.touches[0].clientX), this.boundControlTouchMoveEvent = this.handleControlTouchMove.bind(this), this.boundControlTouchEndEvent = this.handleControlTouchEnd.bind(this), window.addEventListener("touchmove", this.boundControlTouchMoveEvent), window.addEventListener("touchend", this.boundControlTouchEndEvent)
            }
            handleControlTouchMove(e) {
                this.moveDrag(e.touches[0].clientX)
            }
            handleControlTouchEnd(e) {
                e.preventDefault(), window.removeEventListener("touchmove", this.boundControlTouchMoveEvent), window.removeEventListener("touchend", this.boundControlTouchEndEvent), this.stopDrag()
            }
            handleControlMouseDown(e) {
                e.preventDefault(), this.startDrag(e.target, e.clientX), this.boundControlMouseMoveEvent = this.handleControlMouseMove.bind(this), this.boundControlMouseUpEvent = this.handleControlMouseUp.bind(this), window.addEventListener("mousemove", this.boundControlMouseMoveEvent), window.addEventListener("mouseup", this.boundControlMouseUpEvent)
            }
            handleControlMouseMove(e) {
                this.moveDrag(e.clientX)
            }
            handleControlMouseUp(e) {
                e.preventDefault(), window.removeEventListener("mousemove", this.boundControlMouseMoveEvent), window.removeEventListener("mouseup", this.boundControlMouseUpEvent), this.stopDrag()
            }
            startDrag(target, startX) {
                this.controls.min.barControl === target ? this.activeControl = this.controls.min : this.activeControl = this.controls.max, this.dragStartX = startX, this.dragStartValue = this.activeControl.value, this.inDrag = !0
            }
            moveDrag(moveX) {
                if (this.inDrag) {
                    let value = this.dragStartValue + (moveX - this.dragStartX) / this.getPxToValueRatio();
                    this.setActiveControlValue(value), this.render()
                }
            }
            stopDrag() {
                this.inDrag = !1
            }
            handleControlKeyDown(e) {
                e.key === "ArrowRight" ? this.incrementControlFromKeypress(e.target, 10) : e.key === "ArrowLeft" && this.incrementControlFromKeypress(e.target, -10)
            }
            incrementControlFromKeypress(control, pxAmount) {
                this.controls.min.barControl === control ? this.activeControl = this.controls.min : this.activeControl = this.controls.max, this.setActiveControlValue(this.activeControl.value + pxAmount / this.getPxToValueRatio()), this.render()
            }
            handleInputChange(e) {
                e.target.value = e.target.value.replace(/\D/g, ""), (!e.detail || e.detail.sender != "theme:component:price_range") && (this.controls.min.input === e.target ? this.activeControl = this.controls.min : this.activeControl = this.controls.max, this.setActiveControlValue(e.target.value), this.render())
            }
            handleInputKeyup(e) {
                setTimeout(function() {
                    this.value = this.value.replace(/\D/g, "")
                }.bind(e.target), 10)
            }
            bindEvents() {
                [this.controls.min, this.controls.max].forEach(item => {
                    item.barControl.addEventListener("touchstart", this.handleControlTouchStart.bind(this)), item.barControl.addEventListener("mousedown", this.handleControlMouseDown.bind(this)), item.barControl.addEventListener("keydown", this.handleControlKeyDown.bind(this)), item.input.addEventListener("change", this.handleInputChange.bind(this)), item.input.addEventListener("keyup", this.handleInputKeyup.bind(this))
                })
            }
            destroy() {}
        }
        class PriceRange extends ccComponent {
            constructor() {
                let name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "price-range",
                    cssSelector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : `.cc-${name}`;
                super(name, cssSelector)
            }
            init(container) {
                super.init(container), this.registerInstance(container, new PriceRangeInstance(container))
            }
            destroy(container) {
                this.destroyInstance(container), super.destroy(container)
            }
        }
        new PriceRange;
        class StickyScrollDirectionInstance {
            constructor(container) {
                if (!container) {
                    console.warn("StickyScrollDirection component: No container provided");
                    return
                }
                window.innerWidth >= 768 && (this.container = container, this.currentTop = parseInt(getComputedStyle(this.container).top), this.defaultTop = this.currentTop, this.scrollY = window.scrollY, this.bindEvents())
            }
            bindEvents() {
                this.scrollListener = this.handleScroll.bind(this), window.addEventListener("scroll", this.scrollListener), typeof this.container.dataset.ccStickyScrollTop < "u" && (this.observer = new MutationObserver(mutations => {
                    for (let mutation of mutations) mutation.attributeName === "data-cc-sticky-scroll-top" && (this.defaultTop = parseInt(mutation.target.dataset.ccStickyScrollTop))
                }), this.observer.observe(this.container, {
                    attributes: !0
                }))
            }
            handleScroll() {
                const maxTop = this.container.getBoundingClientRect().top + window.scrollY - this.container.offsetTop + this.defaultTop,
                    minTop = this.container.clientHeight - window.innerHeight;
                window.scrollY < this.scrollY ? this.currentTop -= window.scrollY - this.scrollY : this.currentTop += this.scrollY - window.scrollY, this.currentTop = Math.min(Math.max(this.currentTop, -minTop), maxTop, this.defaultTop), this.scrollY = window.scrollY, this.container.style.top = this.currentTop + "px"
            }
            destroy() {
                window.removeEventListener("scroll", this.scrollListener), this.observer && this.observer.disconnect()
            }
        }
        class StickyScrollDirection extends ccComponent {
            constructor() {
                let name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "sticky-scroll-direction",
                    cssSelector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : `.cc-${name}`;
                super(name, cssSelector)
            }
            init(container) {
                super.init(container), this.registerInstance(container, new StickyScrollDirectionInstance(container))
            }
            destroy(container) {
                this.destroyInstance(container), super.destroy(container)
            }
        }
        new StickyScrollDirection, new class extends ccComponent {
            init(container) {
                super.init(container);
                const $container = $(container);
    
                function dispatchTabChangedEvent() {
                    const event = new CustomEvent("cc-tab-changed");
                    window.dispatchEvent(event)
                }
                $container.on("click", "[data-cc-toggle-panel]", function() {
                    const $tabs = $(this).closest(".cc-tabs"),
                        tabIndexToShow = $(this).data("cc-toggle-panel");
                    let $tabToClose = $tabs.find(".cc-tabs__tab__panel:visible");
                    const $tabToOpen = $tabs.find(`.cc-tabs__tab .cc-tabs__tab__panel[aria-labelledby="product-tab-panel${tabIndexToShow}"]`),
                        openAllTabs = $(this).closest('.cc-tabs[data-cc-tab-allow-multi-open="true"]').length;
                    if ($tabs.hasClass("cc-tabs--tab-mode")) $tabToClose.attr("hidden", ""), $tabToOpen.removeAttr("hidden"), $tabs.find('[role="tab"] [aria-selected="true"]').removeAttr("aria-selected"), $tabs.find(`[data-cc-toggle-panel="${tabIndexToShow}"]`).attr("aria-selected", "true");
                    else {
                        if (openAllTabs)
                            if ($tabToOpen.is(":visible")) {
                                var tabNeedsClosing = !0,
                                    tabNeedsOpening = !1;
                                $tabToClose = $tabToOpen
                            } else var tabNeedsClosing = !1,
                                tabNeedsOpening = !0;
                        else var tabNeedsClosing = $tabToClose.length,
                            tabNeedsOpening = $tabToOpen.attr("id") !== $tabToClose.attr("id") && $tabToOpen.length;
                        $(window).outerWidth() < 768 && ($tabToOpen.is(":visible") ? (tabNeedsClosing = !0, tabNeedsOpening = !1, $tabToClose = $tabToOpen) : tabNeedsClosing = !1), tabNeedsClosing && ($tabToClose.slideUp(300, function() {
                            $(this).attr("hidden", ""), tabNeedsOpening || dispatchTabChangedEvent()
                        }), $tabToClose.prev().removeAttr("aria-selected")), tabNeedsOpening && ($tabToOpen.css("display", "none").removeAttr("hidden").slideDown(300, dispatchTabChangedEvent), $tabToOpen.prev().attr("aria-selected", "true"))
                    }
                    return !1
                }), $container.hasClass("cc-tabs--tab-mode") && $container.find(".cc-tabs__tab-headers").ccHoverLine()
            }
            destroy(container) {
                super.destroy(container), $(container).off("click", "[data-cc-toggle-panel]")
            }
        }("tabs"), theme.VideoManager = new function() {
            let _ = this;
            _.videos = {
                incrementor: 0,
                videoData: {}
            }, _._loadYoutubeVideos = function(container) {
                $('.video-container[data-video-type="youtube"]:not(.video--init)', container).each(function() {
                    $(this).addClass("video--init"), _.videos.incrementor++;
                    let containerId = "theme-yt-video-" + _.videos.incrementor;
                    $(this).data("video-container-id", containerId);
                    let autoplay = $(this).data("video-autoplay"),
                        loop = $(this).data("video-loop"),
                        videoId = $(this).data("video-id"),
                        isBackgroundVideo = $(this).hasClass("video-container--background"),
                        ytURLSearchParams = new URLSearchParams("iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&enablejsapi=1&playslinline=1");
                    ytURLSearchParams.append("origin", location.origin), ytURLSearchParams.append("playlist", videoId), ytURLSearchParams.append("loop", loop ? 1 : 0), ytURLSearchParams.append("autoplay", 0), ytURLSearchParams.append("controls", isBackgroundVideo ? 0 : 1);
                    let widgetid = _.videos.incrementor;
                    ytURLSearchParams.append("widgetid", widgetid);
                    let src = "https://www.youtube.com/embed/" + videoId + "?" + ytURLSearchParams.toString(),
                        $videoElement = $('<iframe class="video-container__video-element" frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">').attr({
                            id: containerId,
                            width: 640,
                            height: 360,
                            tabindex: isBackgroundVideo ? "-1" : null
                        }).appendTo($(".video-container__video", this));
                    _.videos.videoData[containerId] = {
                        type: "yt",
                        id: containerId,
                        container: this,
                        mute: () => $videoElement[0].contentWindow.postMessage('{"event":"command","func":"mute","args":""}', "*"),
                        play: () => $videoElement[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*"),
                        pause: () => $videoElement[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*"),
                        stop: () => $videoElement[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', "*"),
                        seekTo: to => $videoElement[0].contentWindow.postMessage(`{"event":"command","func":"seekTo","args":[${to},true]}`, "*"),
                        videoElement: $videoElement[0],
                        isBackgroundVideo,
                        establishedYTComms: !1
                    }, autoplay && $videoElement.on("load", () => setTimeout(() => {
                        window.addEventListener("message", message => {
                            if (message.origin === "https://www.youtube.com" && message.data && typeof message.data == "string") {
                                let data = JSON.parse(message.data);
                                data.event === "initialDelivery" && data.info && data.info.duration && (_.videos.videoData[containerId].duration = data.info.duration), data.event === "infoDelivery" && data.channel === "widget" && data.id === widgetid && (_.videos.videoData[containerId].establishedYTComms = !0, data.info && data.info.playerState === 1 && $(this).addClass("video-container--playing"), loop && data.info && data.info.currentTime > _.videos.videoData[containerId].duration - 1 && _.videos.videoData[containerId].seekTo(0))
                            }
                        }), $videoElement[0].contentWindow.postMessage(`{"event":"listening","id":${widgetid},"channel":"widget"}`, "*"), _.videos.videoData[containerId].mute(), _.videos.videoData[containerId].play(), setTimeout(() => {
                            _.videos.videoData[containerId].establishedYTComms || $(this).addClass("video-container--playing")
                        }, 2e3)
                    }, 100)), isBackgroundVideo && ($videoElement.attr("tabindex", "-1"), _._initBackgroundVideo(_.videos.videoData[containerId]), _.addYTPageshowListenerHack()), $videoElement.attr("src", src), fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent($(this).data("video-url"))).then(response => {
                        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                        return response.json()
                    }).then(response => {
                        response.width && response.height && ($videoElement.attr({
                            width: response.width,
                            height: response.height
                        }), _.videos.videoData[containerId].assessBackgroundVideo && _.videos.videoData[containerId].assessBackgroundVideo())
                    })
                })
            }, _._loadVimeoVideos = function(container) {
                $('.video-container[data-video-type="vimeo"]:not(.video--init)', container).each(function() {
                    $(this).addClass("video--init"), _.videos.incrementor++;
                    var containerId = "theme-vi-video-" + _.videos.incrementor;
                    $(this).data("video-container-id", containerId);
                    var autoplay = $(this).data("video-autoplay");
                    let loop = $(this).data("video-loop"),
                        videoId = $(this).data("video-id"),
                        isBackgroundVideo = $(this).hasClass("video-container--background"),
                        viURLSearchParams = new URLSearchParams;
                    autoplay && viURLSearchParams.append("muted", 1), loop && viURLSearchParams.append("loop", 1), isBackgroundVideo && viURLSearchParams.append("controls", 0);
                    let src = "https://player.vimeo.com/video/" + videoId + "?" + viURLSearchParams.toString(),
                        $videoElement = $('<iframe class="video-container__video-element" frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">').attr({
                            id: containerId,
                            width: 640,
                            height: 360,
                            tabindex: isBackgroundVideo ? "-1" : null
                        }).appendTo($(".video-container__video", this));
                    _.videos.videoData[containerId] = {
                        type: "vimeo",
                        id: containerId,
                        container: this,
                        play: () => $videoElement[0].contentWindow.postMessage('{"method":"play"}', "*"),
                        pause: () => $videoElement[0].contentWindow.postMessage('{"method":"pause"}', "*"),
                        videoElement: $videoElement[0],
                        isBackgroundVideo,
                        establishedVimeoComms: !1
                    }, autoplay && $videoElement.on("load", () => setTimeout(() => {
                        window.addEventListener("message", message => {
                            if (message.origin !== "https://player.vimeo.com" || message.source !== $videoElement[0].contentWindow || !message.data) return;
                            let data = message.data;
                            typeof data == "string" && (data = JSON.parse(data)), (data.method === "ping" || data.event === "playing") && (_.videos.videoData[containerId].establishedVimeoComms = !0), data.event === "playing" && $(this).addClass("video-container--playing")
                        }), $videoElement[0].contentWindow.postMessage({
                            method: "addEventListener",
                            value: "playing"
                        }, "*"), $videoElement[0].contentWindow.postMessage({
                            method: "appendVideoMetadata",
                            value: location.origin
                        }, "*"), $videoElement[0].contentWindow.postMessage({
                            method: "ping"
                        }, "*"), _.videos.videoData[containerId].play(), setTimeout(() => {
                            _.videos.videoData[containerId].establishedVimeoComms || $(this).addClass("video-container--playing")
                        }, 2e3)
                    }, 100)), isBackgroundVideo && ($videoElement.attr("tabindex", "-1"), _._initBackgroundVideo(_.videos.videoData[containerId])), $videoElement.attr("src", src), fetch("https://vimeo.com/api/oembed.json?url=" + encodeURIComponent($(this).data("video-url"))).then(response => {
                        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                        return response.json()
                    }).then(response => {
                        response.width && response.height && ($videoElement.attr({
                            width: response.width,
                            height: response.height
                        }), _.videos.videoData[containerId].assessBackgroundVideo && _.videos.videoData[containerId].assessBackgroundVideo())
                    })
                })
            }, _._loadMp4Videos = function(container) {
                $('.video-container[data-video-type="mp4"]:not(.video--init)', container).addClass("video--init").each(function() {
                    _.videos.incrementor++;
                    var containerId = "theme-mp-video-" + _.videos.incrementor,
                        $container = $(this);
                    $(this).data("video-container-id", containerId);
                    var $videoElement = $('<div class="video-container__video-element">').attr("id", containerId).appendTo($(".video-container__video", this)),
                        autoplay = $(this).data("video-autoplay");
                    let isBackgroundVideo = $(this).hasClass("video-container--background");
                    var $video = $("<video playsinline>");
                    if ($(this).data("video-loop") && $video.attr("loop", "loop"), $video.on("click mouseenter", () => $video.attr("controls", "controls")), autoplay && ($video.attr({
                            autoplay: "autoplay",
                            muted: "muted"
                        }), $video[0].muted = !0, $video.one("loadeddata", function() {
                            this.play(), $container.addClass("video-container--playing")
                        })), $(this).data("video-url") && $video.attr("src", $(this).data("video-url")), $(this).data("video-sources")) {
                        const sources = $(this).data("video-sources").split("|");
                        for (let i2 = 0; i2 < sources.length; i2++) {
                            const [format, mimeType, url] = sources[i2].split(" ");
                            format === "m3u8" && $(this).data("video-loop") || $("<source>").attr({
                                src: url,
                                type: mimeType
                            }).appendTo($video)
                        }
                    }
                    $video.appendTo($videoElement);
                    const videoData = _.videos.videoData[containerId] = {
                        type: "mp4",
                        element: $video[0],
                        play: () => $video[0].play(),
                        pause: () => $video[0].pause(),
                        isBackgroundVideo
                    };
                    isBackgroundVideo && ($video.attr("tabindex", "-1"), autoplay && container.addEventListener("click", videoData.play, {
                        once: !0
                    }))
                })
            }, _._initBackgroundVideo = function(videoData) {
                videoData.container.classList.contains("video-container--background") && (videoData.assessBackgroundVideo = function() {
                    var cw = this.offsetWidth,
                        ch = this.offsetHeight,
                        cr = cw / ch,
                        frame = this.querySelector("iframe"),
                        vr = parseFloat(frame.width) / parseFloat(frame.height),
                        pan = this.querySelector(".video-container__video"),
                        vCrop = 75;
                    if (cr > vr) {
                        var vh = cw / vr + vCrop * 2;
                        pan.style.marginTop = (ch - vh) / 2 - vCrop + "px", pan.style.marginInlineStart = "", pan.style.height = vh + vCrop * 2 + "px", pan.style.width = ""
                    } else {
                        var ph = ch + vCrop * 2,
                            pw = ph * vr;
                        pan.style.marginTop = -vCrop + "px", pan.style.marginInlineStart = (cw - pw) / 2 + "px", pan.style.height = ph + "px", pan.style.width = pw + "px"
                    }
                }.bind(videoData.container), videoData.assessBackgroundVideo(), $(window).on("debouncedresize." + videoData.id, videoData.assessBackgroundVideo), videoData.container.addEventListener("click", videoData.play, {
                    once: !0
                }))
            }, _._unloadVideos = function(container) {
                for (let dataKey in _.videos.videoData) {
                    let data = _.videos.videoData[dataKey];
                    if ($(container).find(data.container).length) {
                        delete _.videos.videoData[dataKey];
                        return
                    }
                }
            }, this.onSectionLoad = function(container) {
                $(".video-container[data-video-url]:not([data-video-type])").each(function() {
                    var url = $(this).data("video-url");
                    url.indexOf(".mp4") > -1 && $(this).attr("data-video-type", "mp4"), url.indexOf("vimeo.com") > -1 && ($(this).attr("data-video-type", "vimeo"), $(this).attr("data-video-id", url.split("?")[0].split("/").pop())), (url.indexOf("youtu.be") > -1 || url.indexOf("youtube.com") > -1) && ($(this).attr("data-video-type", "youtube"), url.indexOf("v=") > -1 ? $(this).attr("data-video-id", url.split("v=").pop().split("&")[0]) : $(this).attr("data-video-id", url.split("?")[0].split("/").pop()))
                }), _._loadYoutubeVideos(container), _._loadVimeoVideos(container), _._loadMp4Videos(container), $(".video-container__play", container).on("click", function(evt) {
                    evt.preventDefault();
                    var $container = $(this).closest(".video-container");
                    $container.addClass("video-container--playing"), $container.trigger("cc:video:play");
                    var id = $container.data("video-container-id");
                    _.videos.videoData[id].play()
                }), $(".video-container__stop", container).on("click", function(evt) {
                    evt.preventDefault();
                    var $container = $(this).closest(".video-container");
                    $container.removeClass("video-container--playing"), $container.trigger("cc:video:stop");
                    var id = $container.data("video-container-id");
                    _.videos.videoData[id].pause()
                })
            }, this.onSectionUnload = function(container) {
                $(".video-container__play, .video-container__stop", container).off("click"), $(window).off("." + $(".video-container").data("video-container-id")), $(window).off("debouncedresize.video-manager-resize"), _._unloadVideos(container), $(container).trigger("cc:video:stop")
            }, _.addYTPageshowListenerHack = function() {
                _.pageshowListenerAdded || (_.pageshowListenerAdded = !0, window.addEventListener("pageshow", event => {
                    event.persisted && Object.keys(_.videos.videoData).filter(key => _.videos.videoData[key].type === "yt" && _.videos.videoData[key].isBackgroundVideo).forEach(key => {
                        _.videos.videoData[key].stop(), _.videos.videoData[key].play()
                    })
                }))
            }
        }, cc.sections.push({
            name: "video",
            section: theme.VideoManager
        }), theme.MapSection = new function() {
            var _ = this;
            _.config = {
                zoom: 14,
                styles: {
                    default: [],
                    silver: [{
                        elementType: "geometry",
                        stylers: [{
                            color: "#f5f5f5"
                        }]
                    }, {
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#616161"
                        }]
                    }, {
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#f5f5f5"
                        }]
                    }, {
                        featureType: "administrative.land_parcel",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#bdbdbd"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry",
                        stylers: [{
                            color: "#eeeeee"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#757575"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "geometry",
                        stylers: [{
                            color: "#e5e5e5"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#9e9e9e"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{
                            color: "#ffffff"
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#757575"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry",
                        stylers: [{
                            color: "#dadada"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#616161"
                        }]
                    }, {
                        featureType: "road.local",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#9e9e9e"
                        }]
                    }, {
                        featureType: "transit.line",
                        elementType: "geometry",
                        stylers: [{
                            color: "#e5e5e5"
                        }]
                    }, {
                        featureType: "transit.station",
                        elementType: "geometry",
                        stylers: [{
                            color: "#eeeeee"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{
                            color: "#c9c9c9"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#9e9e9e"
                        }]
                    }],
                    retro: [{
                        elementType: "geometry",
                        stylers: [{
                            color: "#ebe3cd"
                        }]
                    }, {
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#523735"
                        }]
                    }, {
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#f5f1e6"
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#c9b2a6"
                        }]
                    }, {
                        featureType: "administrative.land_parcel",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#dcd2be"
                        }]
                    }, {
                        featureType: "administrative.land_parcel",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#ae9e90"
                        }]
                    }, {
                        featureType: "landscape.natural",
                        elementType: "geometry",
                        stylers: [{
                            color: "#dfd2ae"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry",
                        stylers: [{
                            color: "#dfd2ae"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#93817c"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#a5b076"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#447530"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{
                            color: "#f5f1e6"
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry",
                        stylers: [{
                            color: "#fdfcf8"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry",
                        stylers: [{
                            color: "#f8c967"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#e9bc62"
                        }]
                    }, {
                        featureType: "road.highway.controlled_access",
                        elementType: "geometry",
                        stylers: [{
                            color: "#e98d58"
                        }]
                    }, {
                        featureType: "road.highway.controlled_access",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#db8555"
                        }]
                    }, {
                        featureType: "road.local",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#806b63"
                        }]
                    }, {
                        featureType: "transit.line",
                        elementType: "geometry",
                        stylers: [{
                            color: "#dfd2ae"
                        }]
                    }, {
                        featureType: "transit.line",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#8f7d77"
                        }]
                    }, {
                        featureType: "transit.line",
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#ebe3cd"
                        }]
                    }, {
                        featureType: "transit.station",
                        elementType: "geometry",
                        stylers: [{
                            color: "#dfd2ae"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#b9d3c2"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#92998d"
                        }]
                    }],
                    dark: [{
                        elementType: "geometry",
                        stylers: [{
                            color: "#212121"
                        }]
                    }, {
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#757575"
                        }]
                    }, {
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#212121"
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry",
                        stylers: [{
                            color: "#757575"
                        }]
                    }, {
                        featureType: "administrative.country",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#9e9e9e"
                        }]
                    }, {
                        featureType: "administrative.land_parcel",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "administrative.locality",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#bdbdbd"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#757575"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "geometry",
                        stylers: [{
                            color: "#181818"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#616161"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#1b1b1b"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#2c2c2c"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#8a8a8a"
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry",
                        stylers: [{
                            color: "#373737"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry",
                        stylers: [{
                            color: "#3c3c3c"
                        }]
                    }, {
                        featureType: "road.highway.controlled_access",
                        elementType: "geometry",
                        stylers: [{
                            color: "#4e4e4e"
                        }]
                    }, {
                        featureType: "road.local",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#616161"
                        }]
                    }, {
                        featureType: "transit",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#757575"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#3d3d3d"
                        }]
                    }],
                    night: [{
                        elementType: "geometry",
                        stylers: [{
                            color: "#242f3e"
                        }]
                    }, {
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#746855"
                        }]
                    }, {
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#242f3e"
                        }]
                    }, {
                        featureType: "administrative.locality",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#d59563"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#d59563"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "geometry",
                        stylers: [{
                            color: "#263c3f"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#6b9a76"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{
                            color: "#38414e"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#212a37"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#9ca5b3"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry",
                        stylers: [{
                            color: "#746855"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#1f2835"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#f3d19c"
                        }]
                    }, {
                        featureType: "transit",
                        elementType: "geometry",
                        stylers: [{
                            color: "#2f3948"
                        }]
                    }, {
                        featureType: "transit.station",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#d59563"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{
                            color: "#17263c"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#515c6d"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#17263c"
                        }]
                    }],
                    aubergine: [{
                        elementType: "geometry",
                        stylers: [{
                            color: "#1d2c4d"
                        }]
                    }, {
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#8ec3b9"
                        }]
                    }, {
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#1a3646"
                        }]
                    }, {
                        featureType: "administrative.country",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#4b6878"
                        }]
                    }, {
                        featureType: "administrative.land_parcel",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#64779e"
                        }]
                    }, {
                        featureType: "administrative.province",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#4b6878"
                        }]
                    }, {
                        featureType: "landscape.man_made",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#334e87"
                        }]
                    }, {
                        featureType: "landscape.natural",
                        elementType: "geometry",
                        stylers: [{
                            color: "#023e58"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry",
                        stylers: [{
                            color: "#283d6a"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#6f9ba5"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#1d2c4d"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#023e58"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#3C7680"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{
                            color: "#304a7d"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#98a5be"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#1d2c4d"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry",
                        stylers: [{
                            color: "#2c6675"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#255763"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#b0d5ce"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#023e58"
                        }]
                    }, {
                        featureType: "transit",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#98a5be"
                        }]
                    }, {
                        featureType: "transit",
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#1d2c4d"
                        }]
                    }, {
                        featureType: "transit.line",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#283d6a"
                        }]
                    }, {
                        featureType: "transit.station",
                        elementType: "geometry",
                        stylers: [{
                            color: "#3a4762"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{
                            color: "#0e1626"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#4e6d70"
                        }]
                    }]
                }
            }, _.apiStatus = null, this.geolocate = function($map) {
                var deferred = $.Deferred(),
                    geocoder = new google.maps.Geocoder,
                    address = $map.data("address-setting");
                return geocoder.geocode({
                    address
                }, function(results, status2) {
                    status2 !== google.maps.GeocoderStatus.OK && deferred.reject(status2), deferred.resolve(results)
                }), deferred
            }, this.createMap = function(container) {
                var $map = $(".map-section__map-container", container);
                return _.geolocate($map).then(function(results) {
                    var mapOptions = {
                        zoom: _.config.zoom,
                        styles: _.config.styles[$(container).data("map-style")],
                        center: results[0].geometry.location,
                        scrollwheel: !1,
                        disableDoubleClickZoom: !0,
                        disableDefaultUI: !0,
                        zoomControl: !$map.data("hide-zoom")
                    };
                    _.map = new google.maps.Map($map[0], mapOptions), _.center = _.map.getCenter();
                    var marker = new google.maps.Marker({
                        map: _.map,
                        position: _.center,
                        clickable: !1
                    });
                    google.maps.event.addDomListener(window, "resize", function() {
                        google.maps.event.trigger(_.map, "resize"), _.map.setCenter(_.center)
                    })
                }.bind(this)).fail(function() {
                    var errorMessage;
                    switch (status) {
                        case "ZERO_RESULTS":
                            errorMessage = theme.strings.addressNoResults;
                            break;
                        case "OVER_QUERY_LIMIT":
                            errorMessage = theme.strings.addressQueryLimit;
                            break;
                        default:
                            errorMessage = theme.strings.addressError;
                            break
                    }
                    if (Shopify.designMode) {
                        var $mapContainer = $map.parents(".map-section");
                        $mapContainer.addClass("page-width map-section--load-error"), $mapContainer.find(".map-section__wrapper").html('<div class="errors text-center">' + errorMessage + "</div>")
                    }
                })
            }, this.onSectionLoad = function(target) {
                var $container = $(target);
                window.gm_authFailure = function() {
                    Shopify.designMode && ($container.addClass("page-width map-section--load-error"), $container.find(".map-section__wrapper").html('<div class="errors text-center">' + theme.strings.authError + "</div>"))
                };
                var key = $container.data("api-key");
                typeof key != "string" || key === "" || theme.loadScriptOnce("https://maps.googleapis.com/maps/api/js?key=" + key, function() {
                    _.createMap($container)
                })
            }, this.onSectionUnload = function(target) {
                typeof window.google < "u" && typeof google.maps < "u" && google.maps.event.clearListeners(_.map, "resize")
            }
        }, cc.sections.push({
            name: "map",
            section: theme.MapSection
        }), theme.Popup = new function() {
            var dismissedStorageKey = "cc-theme-popup-dismissed";
            this.onSectionLoad = function(container) {
                this.namespace = theme.namespaceFromSection(container), this.$container = $(container), this.popup = new ccPopup(this.$container, this.namespace);
                var dismissForDays = this.$container.data("dismiss-for-days"),
                    delaySeconds = this.$container.data("delay-seconds"),
                    showPopup = !0,
                    testMode = this.$container.data("test-mode"),
                    lastDismissed = window.localStorage.getItem(dismissedStorageKey);
                if (lastDismissed) {
                    var dismissedDaysAgo = (new Date().getTime() - lastDismissed) / 864e5;
                    dismissedDaysAgo < dismissForDays && (showPopup = !1)
                }
                this.$container.find(".cc-popup-form__response").length && (showPopup = !0, delaySeconds = 1, this.$container.find(".cc-popup-form__response--success").length && this.functions.popupSetAsDismissed.call(this)), document.querySelector(".shopify-challenge__container") && (showPopup = !1), (showPopup || testMode) && setTimeout(() => {
                    this.popup.open()
                }, delaySeconds * 1e3), this.$container.on("click" + this.namespace, ".cc-popup-close, .cc-popup-background", () => {
                    this.popup.close(() => {
                        this.functions.popupSetAsDismissed.call(this)
                    })
                })
            }, this.onSectionSelect = function() {
                this.popup.open()
            }, this.functions = {
                popupSetAsDismissed: function() {
                    window.localStorage.setItem(dismissedStorageKey, new Date().getTime())
                }
            }, this.onSectionUnload = function() {
                this.$container.off(this.namespace)
            }
        }, cc.sections.push({
            name: "newsletter-popup",
            section: theme.Popup
        }), theme.StoreAvailability = function(container) {
            const loadingClass = "store-availability-loading",
                initClass = "store-availability-initialized",
                storageKey = "cc-location";
            this.onSectionLoad = function(container2) {
                this.namespace = theme.namespaceFromSection(container2), this.$container = $(container2), this.productId = this.$container.data("store-availability-container"), this.sectionUrl = this.$container.data("section-url"), this.$modal, this.$container.addClass(initClass), this.transitionDurationMS = parseFloat(getComputedStyle(container2).transitionDuration) * 1e3, this.removeFixedHeightTimeout = -1, $(window).on(`cc-variant-updated${this.namespace}${this.productId}`, (e, args) => {
                    args.product.id === this.productId && this.functions.updateContent.bind(this)(args.variant ? args.variant.id : null, args.product.title, this.$container.data("has-only-default-variant"), args.variant && typeof args.variant.available < "u")
                }), this.$container.data("single-variant-id") && this.functions.updateContent.bind(this)(this.$container.data("single-variant-id"), this.$container.data("single-variant-product-title"), this.$container.data("has-only-default-variant"), this.$container.data("single-variant-product-available"))
            }, this.onSectionUnload = function() {
                $(window).off(`cc-variant-updated${this.namespace}${this.productId}`), this.$container.off("click"), this.$modal && this.$modal.off("click")
            }, this.functions = {
                getUserLocation: function() {
                    return new Promise((resolve, reject) => {
                        let storedCoords;
                        sessionStorage[storageKey] && (storedCoords = JSON.parse(sessionStorage[storageKey])), storedCoords ? resolve(storedCoords) : navigator.geolocation ? navigator.geolocation.getCurrentPosition(function(position) {
                            const coords = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            };
                            fetch("/localization.json", {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(coords)
                            }), sessionStorage[storageKey] = JSON.stringify(coords), resolve(coords)
                        }, function() {
                            resolve(!1)
                        }, {
                            maximumAge: 36e5,
                            timeout: 5e3
                        }) : resolve(!1)
                    })
                },
                getAvailableStores: function(variantId, cb) {
                    return $.get(this.sectionUrl.replace("VARIANT_ID", variantId), cb)
                },
                calculateDistance: function(coords1, coords2, unitSystem) {
                    var dtor = Math.PI / 180,
                        radius = unitSystem === "metric" ? 6378.14 : 3959,
                        rlat1 = coords1.latitude * dtor,
                        rlong1 = coords1.longitude * dtor,
                        rlat2 = coords2.latitude * dtor,
                        rlong2 = coords2.longitude * dtor,
                        dlon = rlong1 - rlong2,
                        dlat = rlat1 - rlat2,
                        a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.pow(Math.sin(dlon / 2), 2),
                        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return radius * c
                },
                updateLocationDistances: function(coords) {
                    const unitSystem = this.$modal.find("[data-unit-system]").data("unit-system"),
                        self = this;
                    this.$modal.find('[data-distance="false"]').each(function() {
                        const thisCoords = {
                            latitude: parseFloat($(this).data("latitude")),
                            longitude: parseFloat($(this).data("longitude"))
                        };
                        if (thisCoords.latitude && thisCoords.longitude) {
                            const distance = self.functions.calculateDistance(coords, thisCoords, unitSystem).toFixed(1);
                            $(this).html(distance), setTimeout(() => {
                                $(this).closest(".store-availability-list__location__distance").addClass("-in")
                            }, 0)
                        }
                        $(this).attr("data-distance", "true")
                    })
                },
                updateContent: function(variantId, productTitle, isSingleDefaultVariant, isVariantAvailable) {
                    this.$container.off("click", "[data-store-availability-modal-open]"), this.$container.off("click" + this.namespace, ".cc-popup-close, .cc-popup-background"), $(".store-availabilities-modal").remove(), isVariantAvailable ? (this.$container.addClass(loadingClass), this.transitionDurationMS > 0 && this.$container.css("height", this.$container.outerHeight() + "px")) : (this.$container.addClass(loadingClass), this.transitionDurationMS > 0 && this.$container.css("height", "0px")), isVariantAvailable && this.functions.getAvailableStores.call(this, variantId, response => {
                        if (response.trim().length > 0 && !response.includes("NO_PICKUP")) {
                            this.$container.html(response), this.$container.html(this.$container.children().first().html()), this.$container.find("[data-store-availability-modal-product-title]").html(productTitle), isSingleDefaultVariant && this.$container.find(".store-availabilities-modal__variant-title").remove(), this.$container.find(".cc-popup").appendTo("body"), this.$modal = $("body").find(".store-availabilities-modal");
                            const popup = new ccPopup(this.$modal, this.namespace);
                            if (this.$container.on("click", "[data-store-availability-modal-open]", () => (popup.open(), this.functions.getUserLocation().then(coords => {
                                    coords && this.$modal.find('[data-distance="false"]').length && this.functions.getAvailableStores.call(this, variantId, response2 => {
                                        this.$modal.find(".store-availabilities-list").html($(response2).find(".store-availabilities-list").html()), this.functions.updateLocationDistances.bind(this)(coords)
                                    })
                                }), !1)), this.$modal.on("click" + this.namespace, ".cc-popup-close, .cc-popup-background", () => {
                                    popup.close()
                                }), this.$container.removeClass(loadingClass), this.transitionDurationMS > 0) {
                                let newHeight = this.$container.find(".store-availability-container").outerHeight();
                                this.$container.css("height", newHeight > 0 ? newHeight + "px" : ""), clearTimeout(this.removeFixedHeightTimeout), this.removeFixedHeightTimeout = setTimeout(() => {
                                    this.$container.css("height", "")
                                }, this.transitionDurationMS)
                            }
                        }
                    })
                }
            }, this.onSectionLoad(container)
        }, cc.sections.push({
            name: "store-availability",
            section: theme.StoreAvailability
        }), /\/$/.test(theme.routes.root_url) || (theme.routes.root_url += "/");
        class LocalStorageUtil {
            static set(key, value) {
                theme.device.isLocalStorageAvailable() && localStorage.setItem(key, typeof value == "object" ? JSON.stringify(value) : value)
            }
            static get(key, isJson) {
                if (theme.device.isLocalStorageAvailable()) {
                    let value = localStorage.getItem(key);
                    return isJson && (value = JSON.parse(value)), value
                } else return
            }
        }
        theme.addDelegateEventListener = function(element, eventName, selector, callback) {
            let addEventListenerParams = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : null,
                cb = evt => {
                    let el = evt.target.closest(selector);
                    el && element.contains(el) && callback.call(el, evt, el)
                };
            element.addEventListener(eventName, cb, addEventListenerParams)
        }, theme.hideAndRemove = el => {
            el.querySelectorAll("input").forEach(input => {
                input.disabled = !0
            });
            const wrapper = document.createElement("div");
            wrapper.className = "merge-remove-wrapper", el.parentNode.insertBefore(wrapper, el), wrapper.appendChild(el), el.classList.add("merge-remove-item"), wrapper.style.height = `${wrapper.clientHeight}px`;
            const cs = getComputedStyle(el),
                fadeDuration = parseFloat(cs.getPropertyValue("--fade-duration")) * 1e3,
                slideDuration = parseFloat(cs.getPropertyValue("--slide-duration")) * 1e3;
            setTimeout(() => {
                wrapper.classList.add("merge-remove-wrapper--fade"), setTimeout(() => {
                    wrapper.classList.add("merge-remove-wrapper--slide"), setTimeout(() => wrapper.remove(), slideDuration)
                }, fadeDuration)
            }, 10)
        }, theme.insertAndReveal = (el, target, iaeCmd, delay) => {
            const initialDelay = delay || 10;
            el.classList.add("merge-add-wrapper"), target.insertAdjacentElement(iaeCmd, el), el.style.height = `${el.firstElementChild.clientHeight}px`;
            const cs = getComputedStyle(el),
                fadeDuration = parseFloat(cs.getPropertyValue("--fade-duration")) * 1e3,
                slideDuration = parseFloat(cs.getPropertyValue("--slide-duration")) * 1e3;
            setTimeout(() => {
                el.classList.add("merge-add-wrapper--slide"), setTimeout(() => {
                    el.classList.add("merge-add-wrapper--fade"), setTimeout(() => {
                        el.style.height = "", el.classList.remove("merge-add-wrapper", "merge-add-wrapper--slide", "merge-add-wrapper--fade")
                    }, fadeDuration)
                }, slideDuration)
            }, initialDelay)
        }, theme.mergeNodes = (newContent, targetContainer) => {
            try {
                newContent.querySelectorAll("[data-merge]").forEach(newEl => {
                    const targetEl = targetContainer.querySelector(`[data-merge="${newEl.dataset.merge}"]`);
                    (!newEl.dataset.mergeCache || !targetEl.dataset.mergeCache || newEl.dataset.mergeCache !== targetEl.dataset.mergeCache) && (document.body.classList.contains("template-cart") ? targetEl.innerHTML = newEl.innerHTML : newEl.innerHTML = newEl.innerHTML, (newEl.dataset.mergeCache || targetEl.dataset.mergeCache) && (targetEl.dataset.mergeCache = newEl.dataset.mergeCache))
                }), newContent.querySelectorAll("[data-merge-attributes]").forEach(newEl => {
                    const targetEl = targetContainer.querySelector(`[data-merge-attributes="${newEl.dataset.mergeAttributes}"]`);
                    for (const attr of newEl.attributes) targetEl.setAttribute(attr.localName, attr.value)
                }), newContent.querySelectorAll("[data-merge-list]").forEach(newList => {
                    const targetList = targetContainer.querySelector(`[data-merge-list="${newList.dataset.mergeList}"]`);
                    let targetListItems = Array.from(targetList.querySelectorAll("[data-merge-list-item]"));
                    const newListItems = Array.from(newList.querySelectorAll("[data-merge-list-item]"));
                    targetListItems.forEach(targetListItem => {
                        newListItems.find(item => item.dataset.mergeListItem == targetListItem.dataset.mergeListItem) || theme.hideAndRemove(targetListItem)
                    }), targetListItems = Array.from(targetList.querySelectorAll("[data-merge-list-item]:not(.merge-remove-item)"));
                    for (let i2 = 0; i2 < newListItems.length; i2++) {
                        let newListItem = newListItems[i2],
                            matchedItem = targetListItems.find(item => item.dataset.mergeListItem == newListItem.dataset.mergeListItem);
                        matchedItem ? (!newListItem.dataset.mergeCache || !matchedItem.dataset.mergeCache || newListItem.dataset.mergeCache !== matchedItem.dataset.mergeCache) && (matchedItem.innerHTML = newListItem.innerHTML, newListItem.dataset.mergeCache && (matchedItem.dataset.mergeCache = newListItem.dataset.mergeCache)) : (i2 === 0 ? theme.insertAndReveal(newListItem, targetList, "afterbegin", 500) : i2 >= targetListItems.length ? theme.insertAndReveal(newListItem, targetList, "beforeend", 500) : theme.insertAndReveal(newListItem, targetListItems[i2], "beforebegin", 500), targetListItems.splice(i2, 0, newListItem))
                    }
                })
            } catch {
                location.reload()
            }
        }, theme.icons = {
            left: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
            right: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
            close: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
            chevronLightLeft: '<svg fill="#000000" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M 14.51,6.51 14,6 8,12 14,18 14.51,17.49 9.03,12 Z"></path></svg>',
            chevronLightRight: '<svg fill="#000000" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M 10,6 9.49,6.51 14.97,12 9.49,17.49 10,18 16,12 Z"></path></svg>',
            chevronDown: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/><path d="M0-.75h24v24H0z" fill="none"/></svg>',
            tick: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
            add: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
            loading: '<svg xmlns="http://www.w3.org/2000/svg" style="margin: auto; background: transparent; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="currentColor" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(263.279 50 50)"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>',
            chevronRight: '<svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 10.5L5.25 6L0.75 1.5" stroke="#A7A7AE" stroke-linecap="square" stroke-linejoin="round"/></svg>',
            chevronLeft: '<svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 11.5L1.5 6.5L6.5 1.5" stroke="#A7A7AE" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"/></svg>'
        }, theme.swipers = {}, theme.productData = {}, theme.viewport = {
            isXs: () => $(window).outerWidth() < 768,
            isSm: () => $(window).outerWidth() >= 768,
            isMd: () => $(window).outerWidth() >= 992,
            isLg: () => $(window).outerWidth() >= 1200,
            isXlg: () => $(window).outerWidth() >= 1441,
            scroll: {
                currentScrollTop: -1,
                to: function($elem) {
                    let scrollTop = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1,
                        offset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0,
                        cb = arguments.length > 3 ? arguments[3] : void 0;
                    if ($elem && typeof $elem == "string" && ($elem = $($elem)), scrollTop === -1 && $elem && $elem.length) {
                        const navHeight = theme.Nav().bar.isInline() ? 0 : theme.Nav().bar.height();
                        scrollTop = $elem.offset().top - navHeight - offset
                    }
                    $("html,body").animate({
                        scrollTop
                    }, 700, () => {
                        cb && cb()
                    })
                },
                lock: () => {
                    theme.viewport.scroll.currentScrollTop = window.scrollY, document.body.style.top = -window.scrollY + "px", document.body.style.width = "100%", document.body.style.position = "fixed", document.body.scrollHeight > window.outerHeight && (document.body.style.overflowY = "scroll")
                },
                unlock: () => {
                    document.body.style.top = null, document.body.style.overflowY = null, document.body.style.width = null, document.body.style.position = null, window.scrollTo({
                        top: theme.viewport.scroll.currentScrollTop,
                        behavior: "instant"
                    })
                }
            }
        }, theme.device = {
            cache: {
                isTouch: null,
                isRetinaDisplay: null
            },
            isTouch: () => {
                if (theme.device.cache.isTouch !== null) return theme.device.cache.isTouch;
                try {
                    document.createEvent("TouchEvent"), theme.device.cache.isTouch = !0
                } catch {
                    theme.device.cache.isTouch = !1
                } finally {
                    return theme.device.cache.isTouch
                }
            },
            isRetinaDisplay() {
                if (theme.device.cache.isRetinaDisplay !== null) return theme.device.cache.isRetinaDisplay;
                if (window.matchMedia) {
                    const mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
                    theme.device.cache.isRetinaDisplay = mq && mq.matches || window.devicePixelRatio > 1
                } else theme.device.cache.isRetinaDisplay = !1;
                return theme.device.cache.isRetinaDisplay
            },
            isLocalStorageAvailable() {
                try {
                    return localStorage.setItem("a", "a"), localStorage.removeItem("a"), !0
                } catch {
                    return !1
                }
            }
        }, window.Element && !Element.prototype.closest && (Element.prototype.closest = function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i2, el = this;
            do
                for (i2 = matches.length; --i2 >= 0 && matches.item(i2) !== el;); while (i2 < 0 && (el = el.parentElement));
            return el
        });
        const CartForm = class extends HTMLElement {
            connectedCallback() {
                theme.cartNoteMonitor.load($('[name="note"]', this)), this.enableAjaxUpdate = this.dataset.ajaxUpdate, this.enableAjaxUpdate && (this.sectionId = this.dataset.sectionId, this.boundRefresh = evt => {
                    this.refresh(evt.detail)
                }, document.addEventListener("theme:cartchanged", this.boundRefresh), theme.addDelegateEventListener(this, "click", ".cart-item__remove", evt => {
                    evt.preventDefault(), this.adjustItemQuantity(evt.target.closest(".cart-item"), {
                        to: 0
                    })
                }), theme.addDelegateEventListener(this, "click", ".quantity-down", evt => {
                    evt.preventDefault(), this.adjustItemQuantity(evt.target.closest(".cart-item"), {
                        decrease: !0
                    })
                }), theme.addDelegateEventListener(this, "click", ".quantity-up", evt => {
                    evt.preventDefault(), this.adjustItemQuantity(evt.target.closest(".cart-item"), {
                        increase: !0
                    })
                }), theme.addDelegateEventListener(this, "change", ".cart-item__quantity-input", evt => {
                    this.adjustItemQuantity(evt.target.closest(".cart-item"), {
                        currentValue: !0
                    })
                }))
            }
            disconnectedCallback() {
                theme.cartNoteMonitor.unload($('[name="note"]', this)), this.enableAjaxUpdate && document.removeEventListener("theme:cartchanged", this.boundRefresh)
            }
            refresh() {
                this.classList.add("cart-form--refreshing"), fetch(`${window.Shopify.routes.root}?section_id=${this.sectionId}`).then(response => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    return response.text()
                }).then(response => {
                    let frag = document.createDocumentFragment(),
                        newContent = document.createElement("div");
                    frag.appendChild(newContent), newContent.innerHTML = response, newContent.querySelectorAll("[data-cc-animate]").forEach(el => el.removeAttribute("data-cc-animate")), theme.mergeNodes(newContent, this), Array.from(this.querySelectorAll(".cart-item__quantity-input")).filter(el => !el.closest(".merge-remove-item")).forEach((el, index) => {
                        el.dataset.lineIndex = index + 1, el.closest(".cart-item").dataset.index = index + 1
                    }), this.classList.remove("cart-form--refreshing"), this.querySelectorAll(".merge-item-refreshing").forEach(el => el.classList.remove("merge-item-refreshing")), theme.cartNoteMonitor.load($('[name="note"]', this))
                })
            }
            adjustItemQuantity(item, change) {
                const quantityInput = item.querySelector(".cart-item__quantity-input");
                let newQuantity = parseInt(quantityInput.value);
                typeof change.to < "u" ? newQuantity = change.to : change.increase ? newQuantity += quantityInput.step || 1 : change.decrease && (newQuantity -= quantityInput.step || 1), quantityInput.max && newQuantity > parseInt(quantityInput.max) && (newQuantity = parseInt(quantityInput.max)), quantityInput.value = newQuantity, clearTimeout(this.adjustItemQuantityTimeout), this.adjustItemQuantityTimeout = setTimeout(() => {
                    var _this$querySelector;
                    this.querySelectorAll(".cart-item__quantity-input:not([disabled])").forEach(el => {
                        el.value != el.dataset.initialValue && el.closest("[data-merge-list-item]").classList.add("merge-item-refreshing")
                    }), (_this$querySelector = this.querySelector(".cart-list")) === null || _this$querySelector === void 0 || _this$querySelector.classList.add("cart-list--loading"), fetch(`${window.Shopify.routes.root}cart/change.js`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            line: quantityInput.dataset.lineIndex,
                            quantity: newQuantity
                        })
                    }).then(response => {
                        if (!response.ok) throw response;
                        document.dispatchEvent(new CustomEvent("theme:cartchanged", {
                            bubbles: !0,
                            cancelable: !1
                        })), $.get(theme.routes.cart_url, function(data) {
                            var cartUpdateSelector = "#site-control .cart:not(.nav-search)",
                                $newCartObj = $($.parseHTML("<div>" + data + "</div>")).find(cartUpdateSelector);
                            $(cartUpdateSelector).each(function(index) {
                                $($newCartObj[index]).find("[data-cc-animate]").removeAttr("data-cc-animate"), $(this).replaceWith($newCartObj[index])
                            }), cartItem(), $(".as-salomon__cartPage [data-item-property]").each(function(index, item2) {
                                const propertyString = $(item2).attr("data-item-property"),
                                    obj = JSON.parse(propertyString);
                                if (obj.config_image_urls.length > 0) {
                                    const propertyImage = obj.config_image_urls[0];
                                    $(item2).find(".col-image img").attr("src", propertyImage), $(item2).find(".col-image img").attr("srcset", propertyImage)
                                }
                            })
                        })
                    }).catch(error => {
                        error instanceof Response && error.text().then(errorText => {
                            try {
                                quantityInput.value = quantityInput.dataset.initialValue;
                                const errorMessage = JSON.parse(errorText).message,
                                    errorContainer = item.querySelector(".error-message");
                                errorContainer.innerText = errorMessage, setTimeout(() => {
                                    errorContainer.style.height = "0", errorContainer.style.opacity = "0", setTimeout(() => {
                                        errorContainer.style.display = "none"
                                    }, 500)
                                }, 8e3)
                            } catch (parseError) {
                                console.log("Error parsing JSON:", parseError)
                            }
                        })
                    }).finally(() => {
                        var _this$querySelector2;
                        this.querySelectorAll(".merge-item-refreshing").forEach(el => {
                            el.classList.remove("merge-item-refreshing")
                        }), (_this$querySelector2 = this.querySelector(".cart-list")) === null || _this$querySelector2 === void 0 || _this$querySelector2.classList.remove("cart-list--loading")
                    })
                }, newQuantity === 0 ? 10 : 700);
                let customerID = document.querySelector("[customer-main-id]").getAttribute("customer-main-id");
                document.body.classList.contains("template-cart") ? (disableClick(), membershipDiscount(customerID, "cartpage")) : (disableClick(), membershipDiscount(customerID, "cartpopup"))
            }
        };
        window.customElements.define("cart-form", CartForm);
        const CCFetchedContent = class extends HTMLElement {
            connectedCallback() {
                fetch(this.dataset.url).then(response => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    return response.text()
                }).then(response => {
                    let frag = document.createDocumentFragment(),
                        fetchedContent = document.createElement("div");
                    frag.appendChild(fetchedContent), fetchedContent.innerHTML = response;
                    let replacementContent = fetchedContent.querySelector(`[data-id="${CSS.escape(this.dataset.id)}"]`);
                    if (replacementContent && (this.innerHTML = replacementContent.innerHTML, this.hasAttribute("contains-product-blocks"))) {
                        const swiperCont = this.querySelector(".swiper-container");
                        swiperCont && theme.initProductSlider($(swiperCont))
                    }
                })
            }
        };
        window.customElements.define("cc-fetched-content", CCFetchedContent), theme.Nav = function() {
            let $navBar = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : $("#site-control");
            return {
                bar: {
                    turnOpaque: turnOpaque => {
                        turnOpaque ? $navBar.addClass("nav-opaque") : $navBar.removeClass("nav-opaque")
                    },
                    hide: hide => {
                        hide ? $navBar.addClass("nav-hidden") : $navBar.removeClass("nav-hidden")
                    },
                    fadeOut: fadeOut => {
                        fadeOut ? $navBar.addClass("nav-fade-out") : $navBar.removeClass("nav-fade-out")
                    },
                    hideAnnouncement: hide => {
                        hide ? $navBar.addClass("announcement-hidden") : $navBar.removeClass("announcement-hidden")
                    },
                    hasOpaqueSetting: () => $("#site-control").data("opacity").includes("opaque"),
                    hasStickySetting: () => $("#site-control").data("positioning") === "sticky",
                    isInline: () => $("#site-control").data("positioning") === "inline",
                    hasInlineLinks: () => $("#site-control.nav-inline-desktop").length === 1,
                    getPositionSetting: () => $("#site-control").data("positioning"),
                    getOpacitySetting: () => $("#site-control").data("opacity"),
                    isCurrentlyOpaque: () => $("#site-control").hasClass("nav-opaque"),
                    isAnnouncementBar: () => $("#site-control").find(".cc-announcement__inner").length === 1,
                    hasLocalization: () => $("#site-control").hasClass("has-localization"),
                    heightExcludingAnnouncementBar: () => Math.round($("#site-control").find(".site-control__inner").outerHeight()),
                    heightOfAnnouncementBar: () => Math.round($("#site-control").find(".announcement").outerHeight()),
                    height: () => {
                        const $nav = $("#site-control");
                        let height;
                        return $nav.hasClass("announcement-hidden") && $nav.find(".cc-announcement__inner").length ? height = Math.round($nav.find(".cc-announcement__inner").outerHeight() + $nav.find(".site-control__inner").outerHeight()) : height = Math.round($nav.outerHeight()), height
                    }
                }
            }
        }, theme.ProductMediaGallery = function($gallery, $thumbs, isFeaturedProduct, isQuickbuy, galleryId) {
            var _this = this,
                currentMedia, initialisedMedia = {},
                $viewInSpaceButton = $gallery.find(".view-in-space"),
                $swiperCont = $gallery.find(".swiper-container"),
                swiper, preventSizeRedraw = !1,
                vimeoApiReady = !1,
                isFirstRun = !0,
                mediaCount = $gallery.find(".theme-img:visible").length,
                isCarouselLayout = $gallery.data("layout") === "carousel",
                isGalleryNarrow = $gallery.closest(".product-area").hasClass("product-area--restrict-width"),
                $productThumbnails = $gallery.closest(".product-area").find(".product-area__thumbs"),
                isMediaGroupingEnabled = $gallery.data("variant-image-grouping"),
                underlineSelectedMedia = $gallery.data("underline-selected-media");
            const nav = theme.Nav();
            this.Image = function($elem, autoplay) {
                this.show = function() {
                    $elem.addClass("product-media--activated"), $elem.show()
                }, this.play = function() {
                    $gallery.find(".product-media--current").removeClass("product-media--current"), $elem.addClass("product-media--current")
                }, this.destroy = function() {}, this.pause = function() {
                    $elem.removeClass("product-media--activated")
                }, this.hide = function() {
                    $elem.hide()
                }, this.show()
            }, this.Video = function($elem, autoplay) {
                var _video = this,
                    playerObj = {
                        play: function() {},
                        pause: function() {},
                        destroy: function() {}
                    },
                    videoElement = $elem.find("video")[0];
                this.show = function() {
                    $elem.addClass("product-media--activated"), $elem.show(), _this.slideshowTabFix()
                }, this.play = function() {
                    $gallery.find(".product-media--current").removeClass("product-media--current"), $elem.addClass("product-media--current"), _video.show(), playerObj.play()
                }, this.pause = function() {
                    playerObj.pause(), $elem.removeClass("product-media--activated")
                }, this.hide = function() {
                    playerObj.pause(), $elem.hide()
                }, this.destroy = function() {
                    playerObj.destroy(), $(videoElement).off("playing", handlePlay), $(document).off("fullscreenchange", delayedSwiperResize)
                }, theme.loadStyleOnce("https://cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.css"), window.Shopify.loadFeatures([{
                    name: "video-ui",
                    version: "1.0",
                    onLoad: function() {
                        playerObj = {
                            playerType: "html5",
                            element: videoElement,
                            plyr: new Shopify.Plyr(videoElement, {
                                controls: ["play", "progress", "mute", "volume", "play-large", "fullscreen"],
                                loop: {
                                    active: $elem.data("enable-video-looping")
                                },
                                autoplay: theme.viewport.isSm() && autoplay,
                                hideControlsOnPause: !0,
                                iconUrl: "//cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.svg",
                                tooltips: {
                                    controls: !1,
                                    seek: !0
                                }
                            }),
                            play: function() {
                                this.plyr.play()
                            },
                            pause: function() {
                                this.plyr.pause()
                            },
                            destroy: function() {
                                this.plyr.destroy()
                            }
                        }, $elem.addClass("product-media--video-loaded"), $elem.find(".plyr__controls").addClass("swiper-no-swiping"), initialisedMedia[$elem.data("media-id")] = _video
                    }.bind(this)
                }]);
    
                function handlePlay() {
                    _this.pauseAllMedia($elem.data("media-id"))
                }
                $(videoElement).on("playing", handlePlay);
    
                function delayedSwiperResize(event) {
                    preventSizeRedraw = !0, window.innerHeight !== screen.height && setTimeout(function() {
                        preventSizeRedraw = !0
                    }, 200)
                }
                $(document).on("fullscreenchange", delayedSwiperResize), _video.show()
            }, this.ExternalVideo = function($elem, autoplay) {
                var isPlaying = !1,
                    _video = this,
                    playerObj = {
                        play: function() {},
                        pause: function() {},
                        destroy: function() {}
                    },
                    iframeElement = $elem.find("iframe")[0];
                if (this.play = function() {
                        $gallery.find(".product-media--current").removeClass("product-media--current"), $elem.addClass("product-media--current"), _video.show(), playerObj.play()
                    }, this.togglePlayPause = function() {
                        isPlaying ? _video.pause() : _video.play()
                    }, this.pause = function() {
                        playerObj.pause(), $elem.removeClass("product-media--activated")
                    }, this.show = function() {
                        $elem.addClass("product-media--activated"), $elem.show(), _this.slideshowTabFix()
                    }, this.hide = function() {
                        playerObj.pause(), $elem.hide()
                    }, this.destroy = function() {
                        playerObj.destroy(), $elem.off("click", ".product-media--video-mask", _video.togglePlayPause)
                    }, /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(iframeElement.src)) {
                    var loadYoutubeVideo = function() {
                        playerObj = {
                            playerType: "youtube",
                            element: iframeElement,
                            player: new YT.Player(iframeElement, {
                                videoId: $elem.data("video-id"),
                                events: {
                                    onReady: function() {
                                        initialisedMedia[$elem.data("media-id")] = _video, $elem.addClass("product-media--video-loaded"), autoplay && theme.viewport.isSm() && _video.play()
                                    },
                                    onStateChange: function(event) {
                                        event.data === 1 && _this.pauseAllMedia($elem.data("media-id")), isPlaying = event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING || event.data === YT.PlayerState.UNSTARTED, event.data === 0 && $elem.data("enable-video-looping") && event.target.seekTo(0)
                                    }
                                }
                            }),
                            play: function() {
                                this.player.playVideo()
                            },
                            pause: function() {
                                this.player.pauseVideo()
                            },
                            destroy: function() {
                                this.player.destroy()
                            }
                        }
                    };
                    if (window.YT && window.YT.Player) loadYoutubeVideo();
                    else {
                        var temp = window.onYouTubeIframeAPIReady;
                        window.onYouTubeIframeAPIReady = function() {
                            temp && temp(), loadYoutubeVideo()
                        }, theme.loadScriptOnce("https://www.youtube.com/iframe_api")
                    }
                } else if (/vimeo\.com/.test(iframeElement.src)) {
                    let loadVimeoVideos = function() {
                        vimeoApiReady ? ($elem.data("enable-video-looping") && iframeElement.setAttribute("src", iframeElement.getAttribute("src") + "&loop=1"), autoplay && $(window).width() >= 768 && iframeElement.setAttribute("src", iframeElement.getAttribute("src") + "&autoplay=1&muted=1"), playerObj = {
                            playerType: "vimeo",
                            element: iframeElement,
                            player: new Vimeo.Player(iframeElement),
                            play: function() {
                                this.player.play()
                            },
                            pause: function() {
                                this.player.pause()
                            },
                            destroy: function() {
                                this.player.destroy()
                            }
                        }, playerObj.player.ready().then(function() {
                            initialisedMedia[$elem.data("media-id")] = _video, $elem.addClass("product-media--video-loaded")
                        })) : theme.loadScriptOnce("https://player.vimeo.com/api/player.js", function() {
                            vimeoApiReady = !0, loadVimeoVideos()
                        })
                    };
                    loadVimeoVideos()
                }
                $elem.on("click", ".product-media--video-mask", _video.togglePlayPause), _video.show()
            }, this.Model = function($elem, autoplay) {
                var _model = this,
                    playerObj = {
                        play: function() {},
                        pause: function() {},
                        destroy: function() {}
                    },
                    modelElement = $elem.find("model-viewer")[0];
                this.show = function() {
                    $elem.show(), $elem.addClass("product-media--activated"), _this.slideshowTabFix(), _model.updateViewInSpaceButton()
                }, this.updateViewInSpaceButton = function() {
                    window.ShopifyXR && $viewInSpaceButton.length && ($viewInSpaceButton.attr("data-shopify-model3d-id", $elem.data("media-id")), window.ShopifyXR.setupXRElements())
                }, this.play = function() {
                    $gallery.find(".product-media--current").removeClass("product-media--current"), $elem.addClass("product-media--current"), _model.show(), playerObj.play()
                }, this.pause = function() {
                    $elem.removeClass("product-media--activated"), playerObj.pause()
                }, this.hide = function() {
                    playerObj.pause(), $elem.hide(), window.ShopifyXR && $viewInSpaceButton.length && ($viewInSpaceButton.attr("data-shopify-model3d-id", $viewInSpaceButton.data("shopify-model3d-first-id")), $viewInSpaceButton.attr("data-shopify-title", $viewInSpaceButton.data("shopify-first-title")), window.ShopifyXR.setupXRElements())
                }, this.destroy = function() {}, this.initAugmentedReality = function() {
                    if ($(".model-json", $gallery).length) {
                        var doInit = function() {
                            if (!window.ShopifyXR) {
                                document.addEventListener("shopify_xr_initialized", function shopifyXrEventListener(event) {
                                    doInit(), event.target.removeEventListener(event.type, shopifyXrEventListener)
                                });
                                return
                            }
                            window.ShopifyXR.addModels(JSON.parse($(".model-json", $gallery).html())), window.ShopifyXR.setupXRElements()
                        };
                        window.Shopify.loadFeatures([{
                            name: "shopify-xr",
                            version: "1.0",
                            onLoad: doInit
                        }])
                    }
                }, theme.loadStyleOnce("https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css"), window.Shopify.loadFeatures([{
                    name: "model-viewer-ui",
                    version: "1.0",
                    onLoad: function() {
                        playerObj = new Shopify.ModelViewerUI(modelElement), $elem.addClass("product-media--model-loaded"), autoplay && theme.viewport.isSm() && _model.play(), $('<div class="theme-event-proxy">').on("mouseup", function(e) {
                            e.stopPropagation(), e.preventDefault(), document.dispatchEvent(new MouseEvent("mouseup"))
                        }).appendTo($(this).find(".shopify-model-viewer-ui__controls-overlay")), $elem.find("button").attr("type", "button"), $elem.find(".shopify-model-viewer-ui").addClass("swiper-no-swiping")
                    }.bind(this)
                }]), $elem.find("model-viewer").on("shopify_model_viewer_ui_toggle_play", function() {
                    _this.pauseAllMedia($elem.data("media-id")), $elem.addClass("product-media-model--playing"), $gallery.on("click", '.product-media:not([data-media-type="model"])', _model.pause)
                }), $elem.find("model-viewer").on("shopify_model_viewer_ui_toggle_pause", function() {
                    $elem.removeClass("product-media-model--playing"), $gallery.off("click", '.product-media:not([data-media-type="model"])', _model.pause)
                }), $elem.on("click", ".product-media--model-mask", function() {
                    isCarouselLayout ? (_this.swipeToSlideIfNotCurrent($elem), setTimeout(_model.play, 500)) : _model.play()
                }), initialisedMedia[$elem.data("media-id")] = _model, _model.show(), window.ShopifyXR || _model.initAugmentedReality()
            }, this.pauseAllMedia = function(ignoreKey) {
                for (var key in initialisedMedia) initialisedMedia.hasOwnProperty(key) && (!ignoreKey || key != ignoreKey) && initialisedMedia[key].pause()
            }, this.showMedia = function($mediaToShow, autoplay, preventHide) {
                if ($mediaToShow.length) {
                    currentMedia && !preventHide && currentMedia.pause();
                    var getMedia = function(MediaType) {
                        var media;
                        return initialisedMedia.hasOwnProperty($mediaToShow.data("media-id")) ? (media = initialisedMedia[$mediaToShow.data("media-id")], autoplay && theme.viewport.isSm() ? (media.show(), setTimeout(media.play, 250)) : media.show()) : media = new MediaType($mediaToShow, autoplay), media
                    };
                    $mediaToShow.data("media-type") === "image" ? currentMedia = getMedia(_this.Image) : $mediaToShow.data("media-type") === "video" ? currentMedia = getMedia(_this.Video) : $mediaToShow.data("media-type") === "external_video" ? currentMedia = getMedia(_this.ExternalVideo) : $mediaToShow.data("media-type") === "model" ? currentMedia = getMedia(_this.Model) : (console.warn("Media is unknown", $mediaToShow), $gallery.find(".product-media:visible").hide(), $mediaToShow.show())
                }
            }, this.swipeToSlideIfNotCurrent = function($elem) {
                var $slide = $elem.closest(".swiper-slide");
                swiper.slideTo($slide.index(), 500)
            }, this.destroy = function() {
                for (var i2 = 0; i2 < initialisedMedia.length; i2++) initialisedMedia[i2].destroy();
                isCarouselLayout || $(window).off(`load.productTemplateGallery${galleryId} scroll.productTemplateGallery${galleryId}`, detectHeaderOverGallery), $gallery.closest(".product-area").off("click", ".product-area__thumbs__thumb a", handleThumbnailClick), $gallery.off("click", "[data-full-size]", handleImageClick), $gallery.off("variantImageSelected", _this.pauseAllMedia), $(window).off(`ccScrollToMedia.productTemplateGallery${galleryId}`), $(window).off(`.${galleryId}`), $thumbs && $thumbs.length && $thumbs.off("click"), destroySwiper(), destroyColumns(), $productThumbnails.length && destroyThumbnails()
            }, this.slideshowTabFix = function() {
                if (swiper) {
                    var $activeMedia = $swiperCont.find(".product-media--current"),
                        $activeSlide = null;
                    $activeMedia.length ? $activeSlide = $activeMedia.closest(".swiper-slide") : $activeSlide = $swiperCont.find(".swiper-slide.swiper-slide-active"), $activeSlide.find("a, input, button, select, iframe, video, model-viewer, [tabindex]").each(function() {
                        typeof $(this).data("theme-slideshow-original-tabindex") < "u" ? $(this).data("theme-slideshow-original-tabindex") === !1 ? $(this).removeAttr("tabindex") : $(this).attr("tabindex", $(this).data("theme-slideshow-original-tabindex")) : $(this).removeAttr("tabindex")
                    }), $($swiperCont.find(".swiper-slide")).not($activeSlide).find("a, input, button, select, iframe, video, model-viewer, [tabindex]").each(function() {
                        typeof $(this).data("theme-slideshow-original-tabindex") > "u" && $(this).data("theme-slideshow-original-tabindex", typeof $(this).attr("tabindex") < "u" ? $(this).attr("tabindex") : !1), $(this).attr("tabindex", "-1")
                    })
                }
            }, this.scrollToMedia = function(mediaId) {
                const $variantImage = $(`[data-media-id="${mediaId}"]`);
                if ($variantImage.length && ($("body").hasClass("template-product") || isQuickbuy) && theme.viewport.isSm()) {
                    let offset = parseInt($gallery.find(".theme-images").css("padding-top").replace("px", "")),
                        scrollAmount;
                    isQuickbuy ? scrollAmount = $variantImage.offset().top - $(window).scrollTop() + $("#quick-buy-modal").scrollTop() : (scrollAmount = $variantImage.offset().top - offset + 1, (nav.bar.hasOpaqueSetting() && nav.bar.hasStickySetting() || isGalleryNarrow && nav.bar.hasStickySetting() || $gallery.data("column-count") > 1 && $(window).outerWidth() >= 1100) && (scrollAmount -= nav.bar.heightExcludingAnnouncementBar()), scrollAmount < $(window).scrollTop() && nav.bar.getPositionSetting() === "peek" && nav.bar.hasOpaqueSetting() && (scrollAmount -= nav.bar.heightExcludingAnnouncementBar()), scrollAmount = scrollAmount < 200 ? 0 : scrollAmount), $gallery.data("column-count") === 1 && $(window).outerWidth() >= 1100 && isQuickbuy && (scrollAmount -= isGalleryNarrow ? 60 : -1)
                }
            };
    
            function detectHeaderOverGallery() {
                const nav2 = theme.Nav();
                $("body").toggleClass("header-over-gallery", $(window).scrollTop() < $gallery.height() - nav2.bar.height())
            }
    
            function initColumns() {
                const columns = $gallery.data("column-count"),
                    isCollage = $gallery.data("layout") === "collage";
                isCollage && $gallery.find(".theme-img:visible").first().addClass("theme-img--collage-full");
                let $elements = $gallery.find(".theme-img:visible:not(.theme-img--collage-full)"),
                    $finalImage, offset = 0;
                $elements.length % 2 > 0 && isCollage && ($finalImage = $elements.children().last(), offset = 1);
                let elementsPerCol = Math.ceil(($elements.length - offset) / columns);
                const $colContainer = $gallery.find(".theme-images");
                let currentCol = -1,
                    $colWrapper;
                columns > 1 && $elements.length - offset > 1 && $elements.each(function(i2) {
                    (offset === 0 || i2 < $elements.length - offset) && (currentCol < Math.floor(i2 / elementsPerCol) && ($colWrapper = $('<div class="media-column"></div>').appendTo($colContainer), currentCol++), $(this).appendTo($colWrapper))
                }), $finalImage && $finalImage.parent().addClass("theme-img--collage-full").addClass("theme-img--collage-last").appendTo($colContainer)
            }
    
            function destroyColumns() {
                let $colContainer = $gallery.find(".theme-images");
                $colContainer.find(".theme-img").each(function() {
                    $(this).appendTo($colContainer).removeClass("theme-img--collage-full").removeClass("theme-img--collage-last")
                }), $(window).off("debouncedresize.columnheights"), $colContainer.find(".media-column").remove()
            }
            theme.viewport.isSm() && $gallery.data("column-count") === 2 && setTimeout(initColumns, 0), $gallery.find(".product-media").each(function(index) {
                _this.showMedia($(this), !1, !0)
            });
            var $swiperExternalVideos = $swiperCont.find('[data-media-type="external_video"]');
    
            function handleThumbnailClick(e) {
                e.preventDefault();
                const mediaId = $(this).closest("[data-media-thumb-id]").data("media-thumb-id");
                var $media = $gallery.find(`.product-media[data-media-id="${mediaId}"]`);
                return $media.length && ($gallery.closest(".product-area").find(".thumb-active").removeClass("thumb-active"), $(this).addClass("thumb-active"), setTimeout(() => {
                    _this.scrollToMedia(mediaId)
                }, 0)), !1
            }
    
            function handleImageClick() {
                const nav2 = theme.Nav();
                if (theme.viewport.isSm()) {
                    let thisSmallSizeImageUrl = $(this).find(".rimage-wrapper > img")[0].currentSrc;
                    const $allImages = $(this).closest(".theme-images").find("[data-full-size]:visible");
                    let imageHtml = '<a href="#" data-modal-close class="modal-close">&times;</a>';
                    $allImages.each(function() {
                        let smallSizeImageUrl = $(this).find(".rimage-wrapper > img")[0].currentSrc,
                            fullSizeImageUrl = $(this).data("full-size");
                        imageHtml += `<img class="zoom-image" ${thisSmallSizeImageUrl===smallSizeImageUrl?"id='zoom-image'":""} src="${smallSizeImageUrl}" data-full-size="${fullSizeImageUrl}"/>`
                    }), showThemeModal($('<div class="theme-modal theme-modal--fullscreen temp -light"  role="dialog" aria-modal="true"/>').append(`
              <div class='inner-scroller-out'>${imageHtml}</div>`), "product-image", function($modal) {
                        const $mainImage = $("#zoom-image");
                        $mainImage.attr("src", $mainImage.data("full-size")), setTimeout(() => {
                            $modal.find("[data-full-size]").each(function() {
                                $(this).attr("src", $(this).data("full-size"))
                            })
                        }, 100), setTimeout(() => {
                            $modal.scrollTop($mainImage.position().top + ($mainImage.outerHeight() / 2 - $modal.outerHeight() / 2)), $modal.find(".inner-scroller").removeClass("-out")
                        }, 1e3)
                    })
                }
            }
            $gallery.hasClass("theme-gallery--thumbs-enabled") && $gallery.closest(".product-area").on("click", ".product-area__thumbs__thumb a", handleThumbnailClick), $gallery.hasClass("theme-gallery--zoom-enabled") && $gallery.on("click", "[data-full-size]", handleImageClick), $(window).off(`ccScrollToMedia.productTemplateGallery${galleryId}`).on(`ccScrollToMedia.productTemplateGallery${galleryId}`, function(e, mediaId) {
                ($gallery.data("scroll-to-variant-media") !== !1 || theme.viewport.isXs()) && setTimeout(() => {
                    _this.scrollToMedia(mediaId)
                }, 0)
            }), isCarouselLayout ? $swiperExternalVideos.each(function() {
                $(this).width($gallery.outerHeight() * $(this).data("aspectratio"))
            }) : ($(detectHeaderOverGallery), $(window).on(`scroll.productTemplateGallery${galleryId}`, detectHeaderOverGallery));
    
            function initThumbnails() {
                $(".carousel-wrapper .carousel:not(.slick-initialized)", $productThumbnails).each(function($slick) {
                    $(this).on("init reInit setPosition", function() {
                        var lastSlide = $(this).find(".slick-slide:last");
                        if (lastSlide.length > 0) {
                            var slideInnerWidth = lastSlide.position().left + lastSlide.outerWidth(!0),
                                $carouselWrapper = $(this).parent(),
                                carouselWidth = $carouselWrapper.outerWidth(!0);
                            carouselWidth > slideInnerWidth ? $(this).find(".slick-next, .slick-prev").addClass("theme-unnecessary").attr("tabindex", "-1") : $(this).find(".slick-next, .slick-prev").removeClass("theme-unnecessary").attr("tabindex", "0")
                        }
                    }).on("init reInit setPosition", function($slick2) {
                        $(".lazyload--manual", this).removeClass("lazyload--manual").addClass("lazyload"), setTimeout(function() {
                            $($slick2.target).find(".slick-slide a").attr("tabindex", "0")
                        })
                    }).slick({
                        autoplay: !1,
                        fade: !1,
                        infinite: !1,
                        useTransform: !0,
                        arrows: !0,
                        dots: !1,
                        slidesToShow: 5,
                        slidesToScroll: 5,
                        centerMode: !1,
                        verticalSwiping: !0,
                        vertical: !0,
                        prevArrow: '<button type="button" class="slick-prev" aria-label="' + theme.strings.previous + '">' + theme.icons.chevronDown + "</button>",
                        nextArrow: '<button type="button" class="slick-next" aria-label="' + theme.strings.next + '">' + theme.icons.chevronDown + "</button>",
                        responsive: [{
                            breakpoint: 1100,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
                            }
                        }, {
                            breakpoint: 1400,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 4
                            }
                        }]
                    })
                }), theme.viewport.isMd() && (_this.adjustGalleryMargin = () => {
                    $gallery.css("margin-top", `-${$productThumbnails.outerHeight()}px`)
                }, _this.adjustGalleryMargin(), $(window).on("resize.thumbHeight", _this.adjustGalleryMargin), $(window).on("debouncedresizewidth.thumbHeight", _this.adjustGalleryMargin))
            }
    
            function destroyThumbnails() {
                $(".carousel-wrapper .carousel", $productThumbnails).off("init reInit setPosition"), $(".slick-slider", $productThumbnails).slick("unslick"), $(window).off("resize.thumbHeight"), $(window).off("debouncedresizewidth.thumbHeight")
            }
    
            function toggleThumbnailVisibility() {
                $(".slick-slider", $productThumbnails).slick("slickFilter", '[data-cc-hidden="false"]')
            }
    
            function initVariantImageGrouping() {
                const productData = theme.OptionManager.getProductData(null, $gallery.data("product-id"));
                if (productData.media && productData.media.length > 1 && productData.variants && productData.variants.length > 1 && productData.options && productData.options.length > 0) {
                    const colorOptionIndex = function(productOptions) {
                        productOptions = productOptions.map(option => option.toLowerCase());
                        const colorOptions = $gallery.data("variant-image-grouping-option").split(",");
                        for (let colorOption of colorOptions) {
                            const index = productOptions.indexOf(colorOption.trim());
                            if (index > -1) return index
                        }
                        return -1
                    }(productData.options);
                    if (colorOptionIndex > -1) {
                        const mediaByVariantColor = [];
                        productData.variants.forEach(variant => {
                            variant.featured_media && (mediaByVariantColor[variant.featured_media.id] || (mediaByVariantColor[variant.featured_media.id] = []), mediaByVariantColor[variant.featured_media.id].push(variant.options[colorOptionIndex]))
                        });
                        let previousColor;
                        const slideContainer = $gallery[0].querySelector(".theme-images"),
                            allSlides = $gallery[0].querySelectorAll(".theme-img");
                        $gallery.on("variantImageSelected", (e, variant) => {
                            const targetColor = variant.options[colorOptionIndex];
                            let currentColor, newMediaVisible = !1;
                            previousColor != targetColor && ((isCarouselLayout || theme.viewport.isXs()) && (slideContainer.innerHTML = "", slideContainer.append(...allSlides)), $productThumbnails.length && $(".slick-slider", $productThumbnails).slick("slickUnfilter"), productData.media.forEach(media => {
                                mediaByVariantColor[media.id] && (currentColor = mediaByVariantColor[media.id]);
                                const mediaElement = $gallery[0].querySelector(`[data-media-id="${media.id}"]`);
                                if (mediaElement) {
                                    const showMedia = !!(currentColor && currentColor.includes(targetColor));
                                    if (mediaElement.parentElement.getAttribute("aria-hidden") == showMedia.toString() && (newMediaVisible = !0), currentColor || mediaElement.parentElement.remove(), mediaElement.parentElement.setAttribute("aria-hidden", !showMedia), isCarouselLayout || theme.viewport.isXs())
                                        if (showMedia) {
                                            const lazyImage = mediaElement.querySelector(".lazyload--manual");
                                            lazyImage && (lazyImage.classList.remove("lazyload--manual"), lazyImage.classList.add("lazyload"))
                                        } else mediaElement.parentElement.remove();
                                    if ($productThumbnails.length) {
                                        const thumbnailElement = $productThumbnails[0].querySelector(`[data-media-thumb-id="${media.id}"]`);
                                        thumbnailElement && thumbnailElement.setAttribute("data-cc-hidden", !showMedia)
                                    }
                                }
                            }), isCarouselLayout && newMediaVisible && updateSwiperSlidesPerView(), theme.viewport.isSm() && $gallery.data("column-count") === 2 && !isFirstRun && newMediaVisible && setTimeout(() => {
                                destroyColumns(), initColumns()
                            }, 0), $productThumbnails.length && setTimeout(toggleThumbnailVisibility, 0), isFirstRun = !1, previousColor = targetColor)
                        })
                    }
                }
            }
    
            function updateSwiperSlidesPerView() {
                const visibleSlides = $gallery[0].querySelectorAll('.theme-img:not([aria-hidden="true"])'),
                    swiperId = $gallery.find(".swiper-container:first").attr("data-swiper-id");
                if (swiperId) {
                    const thisSwiper = theme.swipers[swiperId];
                    thisSwiper && thisSwiper.params && (thisSwiper.params.breakpoints[1e4].slidesPerView = (visibleSlides.length < 2, 1), $gallery.attr("data-media-count", visibleSlides.length), thisSwiper.currentBreakpoint = !1, thisSwiper.update())
                }
            }
            isMediaGroupingEnabled && initVariantImageGrouping();
            let initialisedSectionVariants = [];
            $gallery.on("variantImageSelected", function(e, args) {
                _this.pauseAllMedia();
                const $container = $(this),
                    sectionId = $container.closest("[data-section-id]").data("section-id");
                if ($(this).find(".swiper-container-horizontal").length) {
                    var swiperId = $(".swiper-container:first", this).attr("data-swiper-id"),
                        swiper2 = theme.swipers[swiperId],
                        $swiperContainer = this;
                    setTimeout(function() {
                        var matchIndex = 0,
                            $match;
                        $('.swiper-container:first .swiper-slide:not([aria-hidden="true"]) .product-media', $swiperContainer).each(function(index) {
                            $(this).data("media-id") == args.featured_media.id && (matchIndex = index, $match = $(this))
                        }), swiper2.update(), swiper2.slideTo(matchIndex, theme.viewport.isXs() ? 500 : 800), underlineSelectedMedia && ($container.find(".product-media--active-variant").removeClass("product-media--active-variant"), $match && $match.closest(".product-media").addClass("product-media--active-variant"))
                    }, args.eventType === "firstrun" ? 1500 : 0)
                } else $(this).hasClass("featured-product__gallery") || (($container.closest(".shopify-section").index() === 0 || initialisedSectionVariants.includes(sectionId)) && $(window).trigger("ccScrollToMedia", args.featured_media.id), initialisedSectionVariants.push(sectionId), $gallery.data("column-count") > 1 && underlineSelectedMedia && ($gallery.find(".product-media--active-variant").removeClass("product-media--active-variant"), $gallery.find(`[data-media-id="${args.featured_media.id}"]`).addClass("product-media--active-variant")));
                setTimeout(() => {
                    const $thumbSlider = $(`[data-section-id="${sectionId}"] .product-area__thumbs .carousel.slick-initialized`);
                    if ($thumbSlider.length === 1 && ($container.data("scroll-to-variant-media") !== !1 || theme.viewport.isXs())) {
                        const $activeSlide = $thumbSlider.find(`[data-media-thumb-id="${args.featured_media.id}"]:first`);
                        $activeSlide.length && ($thumbSlider.find(".thumb-active").removeClass("thumb-active"), $activeSlide.find("a").addClass("thumb-active"), $thumbSlider.slick("slickGoTo", $activeSlide.data("slick-index")))
                    }
                }, 0)
            });
    
            function initSwiper() {
                destroyColumns();
                let extraSwiperOpts = {};
                $swiperCont.data("swiper-nav-style") === "dots" ? extraSwiperOpts = {
                    dynamicBullets: !0,
                    pagination: {
                        el: $swiperCont.find(".swiper-pagination")[0],
                        dynamicBullets: !0
                    }
                } : extraSwiperOpts = {
                    navigation: {
                        nextEl: $swiperCont.find(".swiper-button-next")[0],
                        prevEl: $swiperCont.find(".swiper-button-prev")[0]
                    }
                };
                var swiperOpts = {
                    mode: "horizontal",
                    loop: !1,
                    resizeReInit: !0,
                    autoHeight: !1,
                    scrollContainer: !0,
                    grabCursor: !0,
                    createPagination: !1,
                    preventClicks: !1,
                    freeMode: !1,
                    freeModeFluid: !1,
                    slidesPerView: (mediaCount > 1, 1),
                    spaceBetween: isCarouselLayout && isGalleryNarrow || isFeaturedProduct ? 15 : 0,
                    dynamicBullets: !1,
                    mousewheel: {
                        invert: !0,
                        forceToAxis: !0
                    },
                    scrollbar: {
                        el: $swiperCont.find(".swiper-scrollbar")[0],
                        draggable: !0
                    },
                    ...extraSwiperOpts,
                    breakpoints: {
                        767: {
                            autoHeight: !0,
                            slidesPerView: 1,
                            spaceBetween: 0,
                            freeMode: !1,
                            freeModeFluid: !1,
                            ...extraSwiperOpts
                        },
                        1199: {
                            slidesPerView: 1
                        },
                        1e4: {
                            slidesPerView: (mediaCount > 1, 1)
                        }
                    },
                    on: {
                        init: function() {
                            lazySizes.autoSizer.checkElems(), $swiperCont.find(".swiper-slide-active .lazyload--manual").removeClass("lazyload--manual").addClass("lazyload");
                            let lazyLoadDelay = 500;
                            theme.viewport.isXs() && (lazyLoadDelay = LocalStorageUtil.get("is_first_visit") === null ? 6e3 : 2e3), setTimeout(function() {
                                $swiperCont.find(".lazyload--manual").removeClass("lazyload--manual").addClass("lazyload")
                            }, lazyLoadDelay), theme.viewport.isXs() && $(".product-detail__form__options a:not(.size-chart-link)").length && !isCarouselLayout && ($(".product-detail__form__options a:not(.size-chart-link):first").focus(), setTimeout(() => {
                                $(window).scrollTop(0)
                            }, 500)), theme.viewport.isXs() && /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && (setTimeout(function() {
                                $swiperCont.find(".swiper-wrapper").css("display", "inline-flex").css("vertical-align", "bottom")
                            }, 500), setTimeout(function() {
                                $swiperCont.find(".swiper-wrapper").css("display", "").css("vertical-align", "")
                            }, 1e3))
                        },
                        slideChangeTransitionStart: function() {
                            $swiperCont.find(".swiper-slide-active .lazyload--manual").removeClass("lazyload--manual").addClass("lazyload")
                        },
                        slideChangeTransitionEnd: function(e) {
                            if (_this.pauseAllMedia(), theme.viewport.isXs() || isCarouselLayout) {
                                var $activeMedia = $gallery.find(".swiper-slide-active .product-media"),
                                    activeMediaObj = initialisedMedia[$activeMedia.data("media-id")];
                                activeMediaObj && ($activeMedia.data("media-type") === "model" ? activeMediaObj.updateViewInSpaceButton() : window.ShopifyXR && $viewInSpaceButton.length && ($viewInSpaceButton.attr("data-shopify-model3d-id", $viewInSpaceButton.data("shopify-model3d-first-id")), $viewInSpaceButton.attr("data-shopify-title", $viewInSpaceButton.data("shopify-first-title")), window.ShopifyXR.setupXRElements()))
                            }
                            _this.slideshowTabFix()
                        }
                    }
                };
                swiper = new Swiper($swiperCont, swiperOpts);
                var randomId = new Date().getTime();
                theme.swipers[randomId] = swiper, $swiperCont.attr("data-swiper-id", randomId);
                var startIndex = $gallery.find(".current-img").index();
                swiper.slideTo(startIndex, 0), isCarouselLayout && (underlineSelectedMedia && $gallery.find(".current-img .product-media").addClass("product-media--active-variant"), isMediaGroupingEnabled && updateSwiperSlidesPerView()), $gallery.hasClass("featured-product__gallery--single") && $swiperCont.addClass("swiper-no-swiping"), setTimeout(function() {
                    $(window).trigger("resize"), lazySizes.autoSizer.checkElems(), swiper && swiper.update(), theme.viewport.isSm() && !isCarouselLayout && _this.showMedia($swiperCont.find(".swiper-slide.swiper-slide-active .product-media"), !1, !0), isCarouselLayout && _this.slideshowTabFix()
                }, isCarouselLayout ? 3e3 : 1e3)
            }
    
            function destroySwiper() {
                $swiperCont.removeClass("swiper-no-swiping"), swiper && swiper.destroy(!0), initColumns(), $productThumbnails.length && theme.viewport.isMd() && initThumbnails()
            }
            var swiperEnabled = !1;
    
            function toggleSwiper() {
                theme.viewport.isXs() && !swiperEnabled ? (swiperEnabled = !0, initSwiper()) : theme.viewport.isSm() && swiperEnabled ? (swiperEnabled = !1, destroySwiper(), $swiperCont.find(".lazyload--manual").removeClass("lazyload--manual").addClass("lazyload")) : theme.viewport.isSm() && $swiperCont.find(".lazyload--manual").removeClass("lazyload--manual").addClass("lazyload")
            }
            $(function() {
                isCarouselLayout ? (initSwiper(), $(window).on("cc-mobile-viewport-size-change.swiper", () => {
                    destroySwiper(), initSwiper()
                })) : (toggleSwiper(), $(window).on("debouncedresize.swiper", toggleSwiper)), $productThumbnails.length && theme.viewport.isMd() && initThumbnails()
            })
        }, theme.initContentSlider = function(target, afterChange) {
            $(".slideshow", target).each(function() {
                const autoplaySpeed = $(this).data("autoplay-speed") * 1e3;
                let speed = $(this).data("transition") == "instant" ? 0 : 600;
                $(this).on("init", function() {
                    $(".slick-current .lazyload--manual", this).removeClass("lazyload--manual").addClass("lazyload"), $(function() {
                        setTimeout(() => {
                            $(".lazyload--manual", this).removeClass("lazyload--manual").addClass("lazyload")
                        }, LocalStorageUtil.get("is_first_visit") === null ? 5e3 : 2e3)
                    })
                }).slick({
                    autoplay: $(this).data("autoplay"),
                    fade: !($(this).data("transition") === "slide" && theme.viewport.isXs()),
                    speed,
                    autoplaySpeed,
                    arrows: $(this).data("navigation") == "arrows",
                    dots: $(this).data("navigation") == "dots",
                    infinite: $(this).data("infinite"),
                    useTransform: !0,
                    prevArrow: '<button type="button" class="slick-prev" aria-label="' + theme.strings.previous + '">' + theme.icons.chevronLeft + "</button>",
                    nextArrow: '<button type="button" class="slick-next" aria-label="' + theme.strings.next + '">' + theme.icons.chevronRight + "</button>",
                    pauseOnHover: !1,
                    cssEase: "cubic-bezier(0.25, 1, 0.5, 1)",
                    lazyLoad: $(this).find("[data-lazy]").length > 0 ? "ondemand" : null,
                    customPaging: function(slider, i2) {
                        return `<button class="custom-dot" type="button" data-role="none" role="button" tabindex="0"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" xml:space="preserve"><circle class="circle-one" cx="15" cy="15" r="13" /><circle class="circle-two" cx="15" cy="15" r="13" style="animation-duration: ${autoplaySpeed+speed}ms" /></svg></button>`
                    },
                    responsive: [{
                        breakpoint: 768,
                        settings: {
                            arrows: !1,
                            dots: $(this).data("navigation") != "none",
                            lazyLoad: $(this).find("[data-lazy]").length > 0 ? "progressive" : null
                        }
                    }]
                }).on("beforeChange", function(event, slick, currentSlide, nextSlide) {
                    $(slick.$slides).filter(".slick--out").removeClass("slick--out");
                    const $unloadedImage = $(slick.$slides.get(nextSlide)).find(".lazyload--manual");
                    $unloadedImage.length && $unloadedImage.removeClass("lazyload--manual").addClass("lazyload"), ($(this).data("transition") === "slide" || $(this).data("transition") === "zoom") && $(slick.$slides.get(currentSlide)).addClass("slick--leaving")
                }).on("afterChange", function(event, slick, currentSlide) {
                    $(slick.$slides).filter(".slick--leaving").addClass("slick--out").removeClass("slick--leaving"), afterChange && afterChange(currentSlide)
                })
            })
        }, theme.initProductSlider = function($swiperCont) {
            let isBlog = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
            const slidesInView = $swiperCont.data("products-in-view");
            let breakpoints = {
                767: {
                    slidesPerView: 1.2,
                    spaceBetween: 10
                },
                900: {
                    slidesPerView: slidesInView === 4 || slidesInView === 3 ? 2 : slidesInView
                },
                1439: {
                    slidesPerView: slidesInView === 4 || slidesInView === 3 ? 3 : slidesInView
                },
                3e3: {
                    slidesPerView: slidesInView,
                    spaceBetween: 15
                }
            };
            isBlog && ($swiperCont.data("first-post-big") ? breakpoints = {
                767: {
                    slidesPerView: 1.2,
                    spaceBetween: 10
                },
                1024: {
                    slidesPerView: "auto"
                },
                1600: {
                    slidesPerView: "auto"
                },
                3e3: {
                    slidesPerView: "auto",
                    spaceBetween: 20
                }
            } : breakpoints = {
                767: {
                    slidesPerView: 1.2,
                    spaceBetween: 10
                },
                1024: {
                    slidesPerView: 2
                },
                1600: {
                    slidesPerView: 3
                },
                3e3: {
                    slidesPerView: 4,
                    spaceBetween: 20
                }
            }), new Swiper($swiperCont, {
                mode: "horizontal",
                loop: !1,
                resizeReInit: !0,
                freeMode: !0,
                freeModeFluid: !0,
                scrollContainer: !0,
                grabCursor: !0,
                createPagination: !1,
                slidesPerView: slidesInView,
                spaceBetween: 15,
                mousewheel: {
                    invert: !0,
                    forceToAxis: !0
                },
                scrollbar: {
                    el: $swiperCont.find(".swiper-scrollbar")[0],
                    draggable: !0
                },
                navigation: {
                    nextEl: $swiperCont.find(".js-swiper-button-next")[0],
                    prevEl: $swiperCont.find(".js-swiper-button-prev")[0]
                },
                breakpoints,
                on: {
                    init: function() {
                        lazySizes.autoSizer.checkElems()
                    }
                }
            })
        }, theme.convertOptionsToBoxes = function(container) {
            var $clickies = $(container).find("select[data-make-box]").each(function() {
                $(this).find('option[value=""]').remove()
            }).clickyBoxes().parent().addClass("has-clickyboxes");
            if ($(".selector-wrapper:not(.cc-swatches) .clickyboxes").ccHoverLine({
                    lineCss: {
                        height: "100%"
                    }
                }), $clickies.length > 0)
                for (var productData = theme.OptionManager.getProductData($(container)), optionIndex = 0; optionIndex < productData.options.length; optionIndex++) {
                    for (var optionValues = {}, variantIndex = 0; variantIndex < productData.variants.length; variantIndex++) {
                        var variant = productData.variants[variantIndex];
                        typeof optionValues[variant.options[optionIndex]] > "u" && (optionValues[variant.options[optionIndex]] = !1), variant.available && (optionValues[variant.options[optionIndex]] = !0)
                    }
                    for (var key in optionValues) {
                        let containerTwo = $("[data-sticky-atc] .product-detail__form__options");
                        optionValues[key] || ($(".selector-wrapper:eq(" + optionIndex + ") .clickyboxes li a", containerTwo).filter(function() {
                            return $(this).attr("data-value") == key
                        }).addClass("unavailable"), $(".selector-wrapper:eq(" + optionIndex + ") .clickyboxes li a", container).filter(function() {
                            return $(this).attr("data-value") == key
                        }).addClass("unavailable"))
                    }
                }
        }, theme.loadInfiniteScroll = function(container, cb) {
            let infiniteLoadCount = 1;
            $("[data-infinite-scroll-container] .pagination.infiniscroll:not(.infinit)", container).addClass("infinit").each(function() {
                var waitForTrigger = $(this).hasClass("wait-for-trigger"),
                    $pager = $('<div class="pager-button"><a href="#" aria-label="' + theme.strings.loadMore + '">' + theme.icons.loading + "</a></div>");
                $(this).replaceWith($pager), $pager.find("a").attr("href", $(this).find(".next a").attr("href")), $pager.on("click", "a", function(e) {
                    if ($(this).hasClass("loading")) return !1;
                    $(this).addClass("loading");
                    var $link = $(this);
                    return $.get($(this).attr("href"), function(data) {
                        infiniteLoadCount++;
                        let isCollage = !1;
                        var $data = $($.parseHTML(data));
                        if ($("[data-infinite-scroll-results].product-list--columns", container).length) {
                            isCollage = !0;
                            var $newProducts = $data.find("[data-infinite-scroll-results]").hide();
                            $newProducts.prepend("<h2>" + theme.strings.page.replace("{{ page }}", infiniteLoadCount) + "</h2>");
                            var $newProducts = $newProducts.insertBefore("[data-infinite-scroll-container] .pager-button")
                        } else var $newProducts = $data.find("[data-infinite-scroll-results] .product-block").hide().appendTo("[data-infinite-scroll-results]");
                        if ($("[data-infinite-scroll-container]", container).filter(".product-block").each(function(index) {
                                $(this).removeAttr("data-loop-index").data("loop-index", index), i++
                            }), isCollage) setTimeout(function() {
                            $newProducts.fadeIn(), theme.inlineVideos.init(container), theme.initAnimateOnScroll(), lazySizes.autoSizer.checkElems(), cb && cb()
                        }, 300);
                        else {
                            $("[data-infinite-scroll-results]", container).height($("[data-infinite-scroll-results]", container).height()), $newProducts.addClass("pre-trans").css("display", "");
                            var newHeight = 0;
                            $("[data-infinite-scroll-results]", container).children().each(function() {
                                var h = $(this).position().top + $(this).height();
                                h > newHeight && (newHeight = h)
                            }), $("[data-infinite-scroll-results]", container).animate({
                                height: newHeight
                            }, 500, function() {
                                $(this).css("height", ""), $newProducts.removeClass("pre-trans"), theme.inlineVideos.init(container), theme.initAnimateOnScroll(), new ProductBlock, lazySizes.autoSizer.checkElems(), cb && cb()
                            })
                        }
                        var $next = $data.find("[data-infinite-scroll-container] .pagination .next a");
                        $next.length == 0 ? $pager.slideUp() : $link.attr("href", $next.attr("href")).removeClass("loading"), $("[data-product-wishlist-id]").each(function(index, item) {
                            var productID = parseInt($(item).data("product-wishlist-id"), 10),
                                userID = parseInt($(item).data("customer-wishlist-id"), 10);
                            productID && userID && getWishlist(productID, userID)
                        })
                    }), !1
                }), waitForTrigger || $(window).on("throttled-scroll.infiniscroll", function() {
                    $(window).scrollTop() + $(window).height() > $pager.offset().top - 500 && $pager.find("a").trigger("click")
                })
            })
        }, theme.unloadInfiniteScroll = function(container) {
            container && $(".pagination.infiniscroll.infinit", container).removeClass("infinit"), $(window).off("throttled-scroll.infiniscroll")
        }, theme.applyAjaxToProductForm = function($formContainer) {
            var shopifyAjaxAddURL = theme.routes.cart_add_url + ".js";
            $formContainer.filter('[data-ajax-add-to-cart="true"]:not(.feedback-go_to_cart)').find(".product-purchase-form").on("submit", function(e) {
                e.preventDefault();
                var $form = $(this),
                    $btn = $(this).find("[type=submit]").attr("disabled", "disabled").addClass("confirmation adding");
                $btn.data("originalHtml", $btn.html()).html(theme.strings.productAddingToCart);
                const $stickyBtn = $(".product-area__add-to-cart-xs button"),
                    updateStickyButton = theme.viewport.isXs() && $stickyBtn.length;
                updateStickyButton && ($stickyBtn.attr("disabled", "disabled"), $stickyBtn.data("originalHtml", $stickyBtn.html()).html(theme.strings.productAddingToCart)), $.post(shopifyAjaxAddURL, $form.serialize(), function(itemData) {
                    if ($btn.html(theme.icons.tick + " " + theme.strings.productAddedToCart), updateStickyButton && $stickyBtn.html(theme.icons.tick + " " + theme.strings.productAddedToCart), setTimeout(function() {
                            $btn.removeAttr("disabled").removeClass("confirmation").html($btn.data("originalHtml")), updateStickyButton && $stickyBtn.removeAttr("disabled").removeClass("confirmation").html($stickyBtn.data("originalHtml"))
                        }, 4e3), $form.hasClass("feedback-add_in_modal") || $form.hasClass("feedback-add_in_modal_no_checkout")) {
                        const product = $.parseJSON(itemData),
                            noCheckoutButton = $form.hasClass("feedback-add_in_modal_no_checkout"),
                            thumbUrl = theme.Shopify.formatImage(product.image, "300x"),
                            img = new Image;
                        img.src = thumbUrl, $btn.removeClass("adding");
                        let variantHtml = "",
                            $priceElem = $form.closest(".product-area__details__inner").find(".price-area");
                        if ($priceElem.length && (variantHtml += `<p class="cart-product__content__price">${$priceElem.html()}</p>`), product.selling_plan_allocation && product.selling_plan_allocation.selling_plan.name && (variantHtml += `<p class="cart-product__content__meta">${product.selling_plan_allocation.selling_plan.name}</p>`), product.options_with_values && product.options_with_values.length)
                            for (let i2 = 0; i2 < product.options_with_values.length; i2++) {
                                let option = product.options_with_values[i2];
                                option.name !== "Title" && option.value !== "Default Title" && (variantHtml += `<p class="cart-product__content__meta">${option.name}: ${option.value}</p>`)
                            }
                        let productLineItems = {};
                        const formData = new FormData($form[0]);
                        for (const [key, value] of formData)
                            if (key.indexOf("properties[") === 0 && value) {
                                const name = key.split("[")[1].split("]")[0];
                                name[0] !== "_" && (productLineItems[name] = value)
                            } if (Object.keys(productLineItems).length > 0)
                            for (const key of Object.keys(productLineItems)) {
                                let value = productLineItems[key],
                                    firstChar = key.charAt(0);
                                const tempSpan = document.createElement("span");
                                if (tempSpan.innerText = value, value = tempSpan.innerHTML, key.startsWith("Recipient") && value !== "") variantHtml += `<p class="cart-product__content__meta">${key}: ${value}</p>`;
                                else if (value !== "" && firstChar !== "_")
                                    if (value.includes("/uploads/")) {
                                        let lastPart = value.split("/").pop();
                                        variantHtml += `
                      <span class="cart-product__content__meta">${key}: </span>
                      <a data-cc-animate-click href="${value}">${lastPart}</a>`
                                    } else variantHtml += `
                      <p class="cart-product__content__meta">${key}: ${value}</p>`
                            }
                        let offset = 25;
                        const nav = theme.Nav();
                        nav.bar.getPositionSetting() !== "inline" && (offset = nav.bar.height());
                        let imgAlt = "";
                        product.featured_image && product.featured_image.alt && (imgAlt = product.featured_image.alt), showThemeModal("", null), setTimeout(() => {
                            const modalElement = document.querySelector("[data-cartPopupWrapper]");
                            if (modalElement) {
                                modalElement.classList.add("as-salomon__cartPopupWrapper--active");
                                let customerID = document.querySelector("[customer-main-id]").getAttribute("customer-main-id");
                                membershipDiscount(customerID, "cartpopup")
                            } else console.error("Modal element not found.")
                        }, 500), cartItem(), $(document).on("click", "[data-cartPopupWrapper] .as-salomon__iconImage", function() {
                            $("[data-cartPopupWrapper]").removeClass("as-salomon__cartPopupWrapper--active"), $("body").removeClass("modal-active")
                        }), $(document).on("click", "[data-drawer]", function() {
                            $("[data-cartPopupWrapper]").addClass("as-salomon__cartPopupWrapper--active");
                            let customerID = document.querySelector("[customer-main-id]").getAttribute("customer-main-id");
                            membershipDiscount(customerID, "cartpopup")
                        })
                    } else if ($form.hasClass("feedback-add_and_redirect")) {
                        window.location = theme.routes.cart_url;
                        return
                    }
                    $.get("/pages/main-cart", function(data) {
                        var cartUpdateSelector = '#site-control .cart:not(.nav-search), [data-section-type="cart-template-popup"],[data-section-type="cart-template"]',
                            $newCartObj = $($.parseHTML("<div>" + data + "</div>")).find(cartUpdateSelector);
                        $(cartUpdateSelector).each(function(index) {
                            $($newCartObj[index]).find("[data-cc-animate]").removeAttr("data-cc-animate"), $(this).replaceWith($newCartObj[index]), $(this).parent().find("[data-cc-animate]").removeAttr("data-cc-animate")
                        })
                    })
                }, "text").fail(function(data) {
                    if ($btn.removeAttr("disabled").removeClass("confirmation").html($btn.data("originalHtml")), updateStickyButton && $stickyBtn.removeAttr("disabled").removeClass("confirmation").html($stickyBtn.data("originalHtml")), typeof data < "u" && typeof data.status < "u") {
                        const response = $.parseJSON(data.responseText),
                            $statusMessageContainer = $form.find(".error-message");
                        let error = typeof response.description == "string" ? response.description : response.message;
                        response.errors && typeof response.errors == "object" && (error = Object.entries(response.errors).map(item => item[1].join(", "))), error && ($statusMessageContainer[0].innerHTML = "", (Array.isArray(error) ? error : [error]).forEach((err, index) => {
                            index > 0 && $statusMessageContainer[0].insertAdjacentHTML("beforeend", "<br>"), $statusMessageContainer[0].insertAdjacentText("beforeend", err)
                        }))
                    } else $form.attr("ajax-add-to-cart", "false").submit()
                })
            })
        }, theme.removeAjaxFromProductForm = function($formContainer) {
            $formContainer.find("form.product-purchase-form").off("submit")
        }, theme.OptionManager = new function() {
            var _ = this;
            _._getVariantOptionElement = function(variant, $container) {
                return $container.find('select[name="id"] option[value="' + variant.id + '"]')
            }, _.selectors = {
                container: ".product-area",
                gallery: ".theme-gallery",
                priceArea: ".price-area",
                variantIdInputs: '[name="id"]',
                submitButton: ".product-purchase-form [type=submit], .product-area__add-to-cart-xs button",
                multiOption: ".product-detail__form__options .option-selectors"
            }, _.strings = {
                priceNonExistent: theme.strings.priceNonExistent,
                buttonDefault: theme.strings.buttonDefault,
                buttonPreorder: theme.strings.buttonPreorder,
                buttonNoStock: theme.strings.buttonNoStock,
                buttonNoVariant: theme.strings.buttonNoVariant,
                unitPriceSeparator: theme.strings.unitPriceSeparator,
                inventoryNotice: theme.strings.onlyXLeft,
                inventoryLowStock: theme.strings.inventoryLowStock,
                inventoryInStock: theme.strings.inventoryInStock,
                priceSoldOut: theme.strings.priceSoldOut
            }, _._getString = function(key, variant) {
                var string = _.strings[key];
                return variant && (string ? string = string.replace("[PRICE]", '<span class="theme-money">' + theme.Shopify.formatMoney(variant.price, theme.money_format_with_code_preference) + "</span>") : console.warn(`No string for key '${key}' was found.`)), string
            }, _.getProductData = function($form, productId) {
                productId || (productId = $form.data("product-id"));
                var data = null;
                return theme.productData[productId] || (theme.productData[productId] = JSON.parse(document.getElementById("cc-product-json-" + productId).innerHTML)), data = theme.productData[productId], data || console.log("Product data missing (id: " + $form.data("product-id") + ")"), data
            }, _.getBaseUnit = function(variant) {
                return variant.unit_price_measurement.reference_value === 1 ? variant.unit_price_measurement.reference_unit : variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit
            }, _.addVariantUrlToHistory = function(variant) {
                if (variant) {
                    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?variant=" + variant.id;
                    window.history.replaceState({
                        path: newurl
                    }, "", newurl)
                }
            }, _.updateSku = function(variant, $container) {
                $container.find(".sku .sku__value").html(variant ? variant.sku : ""), $container.find(".sku").toggleClass("sku--no-sku", !variant || !variant.sku)
            }, _.updateBarcode = function(variant, $container) {
                $container.find(".barcode .barcode__value").html(variant ? variant.barcode : ""), $container.find(".barcode").toggleClass("barcode--no-barcode", !variant || !variant.barcode)
            }, _.updateInventoryNotice = function(variant, $container) {
                const $inventoryNotice = $container.find(".product-inventory-notice"),
                    $inventoryNoticeText = $container.find(".product-inventory-notice__text"),
                    $inventoryNoticeIndicator = $container.find(".product-inventory-notice__indicator");
                if ($inventoryNotice.length) {
                    const invCount = _._getVariantOptionElement(variant, $container).data("inventory"),
                        invData = $inventoryNotice[0].dataset,
                        showInventoryCount = invData.showInventoryCount === "always" || invData.showInventoryCount === "low" && invCount <= invData.inventoryThreshold;
                    let notice;
                    if (showInventoryCount ? notice = _._getString("inventoryNotice").replace("[[ quantity ]]", invCount) : invCount <= parseInt(invData.inventoryThreshold) ? notice = _._getString("inventoryLowStock") : notice = _._getString("inventoryInStock"), $inventoryNoticeIndicator.length === 1) {
                        const $bar = $inventoryNoticeIndicator.find("span");
                        let newWidth;
                        invCount >= invData.indicatorScale ? newWidth = 100 : newWidth = (100 / parseInt(invData.indicatorScale) * invCount).toFixed(1), invCount <= parseInt(invData.inventoryThreshold) ? $bar.css("width", newWidth + "%").css("background-color", invData.indicatorScaleColorBelow) : $bar.css("width", newWidth + "%").css("background-color", invData.indicatorScaleColorAbove)
                    }
                    invCount && invCount > 0 && (invData.showInventoryNotice === "always" || invCount <= parseInt(invData.inventoryThreshold)) ? ($inventoryNotice.removeClass("product-inventory-notice--no-inventory").slideDown(300), $inventoryNoticeText.html(notice)) : $inventoryNotice.addClass("product-inventory-notice--no-inventory").slideUp(300)
                }
            }, _.updateQtySelectors = function(variant, $container) {
                try {
                    const invCount = _._getVariantOptionElement(variant, $container).data("inventory"),
                        qtyWrapper = $container.find(".quantity-wrapper"),
                        qtyInput = qtyWrapper.find("input"),
                        qtyInputVal = parseInt(qtyInput.val());
                    qtyWrapper && (qtyWrapper.find("[data-quantity]").removeAttr("disabled"), invCount <= qtyInputVal && (qtyInput.val(invCount < 1 ? 1 : invCount), qtyWrapper.find('[data-quantity="up"]').attr("disabled", "")))
                } catch (err) {
                    console.log(err)
                }
            }, _.updateBackorder = function(variant, $container) {
                var $backorder = $container.find(".backorder");
                if ($backorder.length)
                    if (variant && variant.available)
                        if (variant.inventory_management && _._getVariantOptionElement(variant, $container).data("stock") == "out") {
                            var productData = _.getProductData($container);
                            $backorder.find(".backorder__variant").html(productData.title + (variant.title.indexOf("Default") >= 0 ? "" : " - " + variant.title)), $backorder.show()
                        } else $backorder.hide();
                else $backorder.hide()
            }, _.updatePrice = function(variant, $container, quantity) {
                const $priceArea = $container.find(_.selectors.priceArea);
                if ($priceArea.removeClass("on-sale"), !variant) {
                    $priceArea.html(`<span class="current-price">${_.strings.priceNonExistent}</span>`);
                    return
                }
                const compareAtPrice = variant.compare_at_price || 0,
                    variantPrice = variant.price || 0,
                    tierDiscountRate = $priceArea.data("discountedPercentage") || 0,
                    productDiscountRate = calculateDiscountRate(compareAtPrice, variantPrice);
                var $newPriceArea = $("<div>");
                appendDiscountInfo($newPriceArea, $priceArea, compareAtPrice, variantPrice, productDiscountRate, tierDiscountRate, quantity), variant.unit_price_measurement && appendUnitPriceInfo(variant, quantity, $newPriceArea), $priceArea.html($newPriceArea.html())
            };
    
            function calculateDiscountRate(compareAtPrice, variantPrice) {
                return compareAtPrice > variantPrice ? (compareAtPrice - variantPrice) / compareAtPrice * 100 : 0
            }
    
            function appendDiscountInfo($newPriceArea, $priceArea, compareAtPrice, variantPrice, productDiscountRate, tierDiscountRate, quantity) {
                if (productDiscountRate > tierDiscountRate && (appendPriceSpan($newPriceArea, "was-price compare-at-price", compareAtPrice * quantity), $newPriceArea.append(" "), $priceArea.addClass("on-sale")), tierDiscountRate > 0) {
                    const basePrice = compareAtPrice > variantPrice ? compareAtPrice : variantPrice,
                        discountAmount = basePrice * (tierDiscountRate / 100),
                        discountedPrice = basePrice - discountAmount;
                    appendPriceSpan($newPriceArea, "was-price", basePrice * quantity), appendPriceSpan($newPriceArea, "current-price", discountedPrice * quantity)
                } else appendPriceSpan($newPriceArea, "current-price", variantPrice * quantity)
            }
    
            function appendPriceSpan($parentElement, className, amount) {
                $("<span>", {
                    class: `${className} theme-money`,
                    html: theme.Shopify.formatMoney(amount, theme.money_format_with_code_preference)
                }).appendTo($parentElement)
            }
    
            function appendUnitPriceInfo(variant, quantity, $newPriceArea) {
                var $newUnitPriceArea = $('<div class="unit-price">').appendTo($newPriceArea);
                appendPriceSpan($newUnitPriceArea, "unit-price__price", variant.unit_price * quantity), $('<span class="unit-price__separator">').html(_._getString("unitPriceSeparator")).appendTo($newUnitPriceArea), $('<span class="unit-price__unit">').html(_.getBaseUnit(variant)).appendTo($newUnitPriceArea)
            }
            _._updateButtonText = function($button, string, variant) {
                $button.each(function() {
                    var newVal;
                    newVal = _._getString("button" + string, variant), newVal !== !1 && ($(this).is("input") ? $(this).val(newVal) : $(this).html(newVal))
                })
            }, _.updateButtons = function(variant, $container) {
                var $button = $container.find(_.selectors.submitButton);
                variant && variant.available == !0 ? ($button.removeAttr("disabled"), $container.data("is-preorder") ? _._updateButtonText($button, "Preorder", variant) : _._updateButtonText($button, "Default", variant)) : ($button.attr("disabled", "disabled"), variant ? _._updateButtonText($button, "NoStock", variant) : _._updateButtonText($button, "NoVariant", variant))
            }, _.updateContainerStatusClasses = function(variant, $container) {
                $container.toggleClass("variant-status--unavailable", !variant.available), $container.toggleClass("variant-status--backorder", variant.available && variant.inventory_management && _._getVariantOptionElement(variant, $container).data("stock") == "out")
            }, _.updateVariantOptionStatusClasses = function(variant, $container) {
                const productData = _.getProductData($container);
    
                function getMatchingVariants(optionValues) {
                    return productData.variants.filter(thisVariant => {
                        let variantMatches = !0;
                        for (let j = 0; j < optionValues.length; j++)
                            if (thisVariant.options[j] !== optionValues[j]) {
                                variantMatches = !1;
                                break
                            } return variantMatches
                    })
                }
    
                function getAllValuesForOption(i2) {
                    let allOptionValues = {};
                    for (var l = 0; l < productData.variants.length; l++) {
                        let value = productData.variants[l].options[i2];
                        value && (allOptionValues[value] = !1)
                    }
                    return allOptionValues
                }
                if (variant === !1 && (variant = {
                        options: []
                    }, $container.find(".selector-wrapper a.active[data-value]").each(function() {
                        variant.options.push($(this).data("value"))
                    })), variant && variant.options && variant.options.length > 1) {
                    let optionValues = [...variant.options],
                        optionStock = {};
                    for (let i2 = variant.options.length - 1; i2 >= 0; i2--) {
                        optionValues.pop();
                        let optionAvailability = getAllValuesForOption(i2),
                            matchingVariants = getMatchingVariants(optionValues);
                        for (let k = 0; k < matchingVariants.length; k++)
                            if (matchingVariants[k].available) {
                                let value = matchingVariants[k].options[i2];
                                value && (optionAvailability[value] = !0)
                            } optionStock[productData.options[i2]] = optionAvailability
                    }
                    $(".selector-wrapper", $container).each(function() {
                        const optionName = $(this).data("option-name");
                        for (let [option, isAvailable] of Object.entries(optionStock[optionName])) option = removeDiacritics(option).toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/-*$/, ""), $(this).find(`.clickyboxes .opt--${option}`).toggleClass("unavailable", !isAvailable)
                    })
                }
            }, _.initProductOptions = function($productForm) {
                if (!$productForm.hasClass("theme-init")) {
                    var productData = _.getProductData($productForm);
                    $productForm.addClass("theme-init"), $productForm.find(_.selectors.multiOption).on("change.themeProductOptions", "select", function() {
                        var selectedOptions = [];
                        $(this).closest(_.selectors.multiOption).find("select").each(function() {
                            selectedOptions.push($(this).val())
                        });
                        for (var variant = !1, i2 = 0; i2 < productData.variants.length; i2++) {
                            for (var v = productData.variants[i2], matchCount = 0, j = 0; j < selectedOptions.length; j++) v.options[j] == selectedOptions[j] && matchCount++;
                            if (matchCount == selectedOptions.length) {
                                variant = v;
                                break
                            }
                        }
                        variant && $productForm.find(_.selectors.variantIdInputs).val(variant.id), $productForm.find(_.selectors.variantIdInputs).each(function() {
                            this.dispatchEvent(new CustomEvent("change", {
                                bubbles: !0,
                                cancelable: !1,
                                detail: variant
                            }))
                        })
                    }), $productForm.find(_.selectors.customOption).each(function() {
                        const $input = $(this).find("input:first, textarea, select");
                        $('<input type="hidden">').attr({
                            name: $input.attr("name"),
                            value: $input.val()
                        }).appendTo($productForm.find(_.selectors.purchaseForm))
                    }).on("change.themeProductOptions", function() {
                        const $radios = $(this).find('input[type="radio"]'),
                            $checkbox = $(this).find('input[type="checkbox"]');
                        if ($radios.length) $productForm.find(_.selectors.purchaseForm + " input").filter(function() {
                            return this.name === $radios[0].name
                        }).val($radios.filter(":checked").val()).trigger("change");
                        else if ($checkbox.length) {
                            let val = null;
                            $checkbox.is(":checked") ? val = $checkbox.val() : val = $checkbox.siblings('[type="hidden"]').val(), $productForm.find(_.selectors.purchaseForm + " input").filter(function() {
                                return this.name === $checkbox[0].name
                            }).val(val).trigger("change")
                        } else {
                            const $input = $(this).find("select, input, textarea");
                            $productForm.find(_.selectors.purchaseForm + " input").filter(function() {
                                return this.name === $input.attr("name")
                            }).val($input.val()).trigger("change")
                        }
                    }), $productForm.find(_.selectors.variantIdInputs).each(function() {
                        $(this).on("change.themeProductOptions firstrun.themeProductOptions", function(e) {
                            if ($(this).is("input[type=radio]:not(:checked)")) return;
                            var variant = e.detail;
                            if (!variant && variant !== !1)
                                for (var i2 = 0; i2 < productData.variants.length; i2++) productData.variants[i2].id == $(this).val() && (variant = productData.variants[i2]);
                            var $container = $(this).closest(_.selectors.container),
                                $addToCart = $container.find(_.selectors.submitButton).filter("[data-add-to-cart-text]");
                            $addToCart.length && (_.strings.buttonDefault = $addToCart.data("add-to-cart-text")), _.updatePrice(variant, $container, 1), document.querySelectorAll("[data-quantity]").forEach(button => {
                                button.addEventListener("click", () => {
                                    let $quantity = button.parentElement.querySelector('[name="quantity"]');
                                    setTimeout(() => {
                                        _.updatePrice(variant, $container, $quantity.value), document.querySelectorAll('[name="quantity"]').forEach(q => {
                                            q.value = $quantity.value
                                        }), document.dispatchEvent(new Event("UpdatedPriceWithQuantity"))
                                    }, 250)
                                })
                            }), _.updateButtons(variant, $container), $(window).trigger("cc-variant-updated", {
                                variant,
                                product: productData
                            }), $(window).trigger("debouncedresizewidth"), variant && variant.featured_media && $container.find(_.selectors.gallery).trigger("variantImageSelected", variant), _.updateBarcode(variant, $container), _.updateSku(variant, $container), _.updateInventoryNotice(variant, $container), _.updateQtySelectors(variant, $container), _.updateBackorder(variant, $container), _.updateContainerStatusClasses(variant, $container), $productForm.find('[data-show-realtime-availability="true"]').length > 0 && _.updateVariantOptionStatusClasses(variant, $productForm), $productForm.data("enable-history-state") && e.type == "change" && _.addVariantUrlToHistory(variant), $productForm.find(".quickbuy-container").trigger("changedsize"), $productForm.trigger("variantChanged", variant)
                        }), $(this).trigger("firstrun")
                    }), theme.applyAjaxToProductForm($productForm)
                }
            }, _.unloadProductOptions = function($productForm) {
                $productForm.removeClass("theme-init").each(function() {
                    $(this).trigger("unloading").off(".themeProductOptions"), $(this).find(_.selectors.multiOption).off(".themeProductOptions"), theme.removeAjaxFromProductForm($productForm)
                })
            }
        }, theme.addControlPaddingToModal = function() {
            $(".theme-modal.reveal > .inner").css("padding-top", theme.Nav().bar.height())
        }, theme.allowRTEFullWidthImages = function(container) {
            $(".rte--allow-full-width-images p > img, .rte--allow-full-width-images div > img", container).each(function() {
                $(this).siblings().length == 0 && $(this).parent().addClass("no-side-pad")
            }), $(".rte--allow-full-width-images p > a > img, .rte--allow-full-width-images div > a > img", container).each(function() {
                $(this).siblings().length == 0 && $(this).parent().siblings().length == 0 && $(this).parent().addClass("no-side-pad")
            })
        }, theme.browserHas3DTransforms = function() {
            var el = document.createElement("p"),
                has3d, transforms = {
                    webkitTransform: "-webkit-transform",
                    OTransform: "-o-transform",
                    msTransform: "-ms-transform",
                    MozTransform: "-moz-transform",
                    transform: "transform"
                };
            document.body.insertBefore(el, null);
            for (var t in transforms) el.style[t] !== void 0 && (el.style[t] = "translate3d(1px,1px,1px)", has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]));
            return document.body.removeChild(el), has3d !== void 0 && has3d.length > 0 && has3d !== "none"
        }, theme.browserHas3DTransforms() && $("html").addClass("supports-transforms"), theme.namespaceFromSection = function(container) {
            return [".", $(container).data("section-type"), $(container).data("section-id")].join("")
        }, theme.inlineVideos = {
            init: target => {
                $(".section-background-video--inline", target).each(function() {
                    theme.VideoManager.onSectionLoad($(this)[0]), $(this).addClass("cc-init")
                })
            },
            destroy: target => {
                $(".section-background-video--inline", target).each(function() {
                    theme.VideoManager.onSectionUnload($(this)[0]), $(this).removeClass("cc-init")
                })
            }
        }, theme.initShopifyPaymentButtons = function($elem) {
            if (Shopify.PaymentButton && $elem.find(".shopify-payment-button").length) {
                var f = null;
                f = function() {
                    document.removeEventListener("shopify:payment_button:loaded", f), $elem.trigger("changedsize")
                }, document.addEventListener("shopify:payment_button:loaded", f), Shopify.PaymentButton.init()
            }
        }, theme.initComponents = function($elem) {
            const $components = $elem.find("[data-components]");
            $components.length && $components.data("components").split(",").forEach(component => {
                $(document).trigger("cc:component:load", [component, $elem[0]])
            })
        }, theme.assessFullWidthSections = function() {
            document.querySelectorAll("#page-content .shopify-section > .use-alt-bg").forEach(elem => elem.parentElement.classList.add("has-alt-bg"))
        }, theme.updateNavHeight = function() {
            const nav = theme.Nav();
            document.documentElement.style.setProperty("--nav-height", nav.bar.height() + "px"), document.querySelectorAll("[data-cc-sticky-scroll-top]").forEach(elem => {
                elem.setAttribute("data-cc-sticky-scroll-top", nav.bar.height() + 20)
            })
        }, theme.init = function() {
            theme.checkViewportFillers(), theme.assessAltLogo(), theme.assessFullWidthSections(), theme.calc100vh(), theme.updateNavHeight()
        }, theme.windowResize = function() {
            theme.calc100vh(), theme.updateNavHeight()
        }, jQuery(function($2) {
            $2(document).on("click", "[data-cc-quick-buy]", function() {
                const nav = theme.Nav(),
                    productUrl = $2(this).attr("href");
                theme.currentQuickbuyRequest && theme.currentQuickbuyRequest.abort(), showThemeModal(`<div class="theme-modal theme-modal--fullscreen theme-modal--quickbuy -light" id="quick-buy-modal" role="dialog" aria-modal="true"/>
                            <a href="#" data-modal-close class="modal-close">&times;</a>
                            <div class="theme-modal__loading">${theme.icons.loading}</div>
                        </div>`, "quick-buy", null);
                var ajaxUrl = productUrl;
                return theme.currentQuickbuyRequest = $2.get(ajaxUrl, function(response) {
                    const $quickbuyModal = $2("#quick-buy-modal"),
                        $productDetail = $2("<div>" + response + "</div>").find(".section-product-template"),
                        $section = $productDetail.find('[data-section-type="product-template"]')[0];
                    $productDetail.find(".store-availability-container-outer").remove(), $productDetail.find('[data-show-in-quickbuy="false"]').remove(), $productDetail.find(".theme-gallery--zoom-enabled").removeClass("theme-gallery--zoom-enabled"), $productDetail.find(".product-area__details__title").wrapInner($2("<a>").attr("href", productUrl).attr("data-cc-animate-click", "true")), $productDetail.find(".product-detail__more_details a").attr("href", productUrl), $quickbuyModal.find(".theme-modal__loading").replaceWith($productDetail), theme.initAnimateOnScroll(), theme.ProductTemplateSection.onSectionLoad($section, !0), theme.initComponents($quickbuyModal), theme.initShopifyPaymentButtons($quickbuyModal), $2(window).one("ccModalClosing", function() {
                        theme.ProductTemplateSection.onSectionUnload($section, !0)
                    })
                }).always(function() {
                    theme.currentQuickbuyRequest = !1
                }), !1
            })
        });
        class ProductBlockInstance {
            constructor(container) {
                this.productBlock = container, this.productBlockImageContainer = this.productBlock.querySelector(".image"), this.imageContainer = this.productBlock.querySelector(".image-inner"), this.swatchesContainer = this.productBlock.querySelector(".cc-swatches"), this.slideDuration = 1e3, this.swatchImagesPreloaded = !1, this.imageSliderLoaded = !1, this.widths = [460, 540, 720, 900, 1080, 1296, 1512, 1728, 2048], this.imageWidth, this.hoverTimeout, this.preloadedImages = [], this.swatches = [], this.bindEvents(), this.productBlock.querySelector('[data-section-type="background-video"]') && this.initImageSlider()
            }
            showNextSlideImage() {
                this.hoverTimeout = setTimeout(() => {
                    const slides = this.imageContainer.querySelectorAll(".product-block--slide");
                    if (slides && slides.length > 1) {
                        if (!this.imageContainer.querySelector(".product-block--slide.-in")) this.imageContainer.querySelector(".image__first").classList.add("-out"), slides[1].classList.add("-in");
                        else
                            for (let i2 = 0; i2 < slides.length; i2++)
                                if (slides[i2].classList.contains("-in")) {
                                    slides[i2].classList.remove("-in"), i2 === slides.length - 1 ? (this.destroyImageSliderLoadingBar(), slides[0].classList.add("-in"), this.initImageSliderLoadingBar()) : slides[i2 + 1].classList.add("-in");
                                    break
                                }
                    }
                    this.showNextSlideImage()
                }, this.slideDuration)
            }
            showSpecificSlideImage(imageUrl) {
                const imageUrlStart = imageUrl.substring(0, imageUrl.lastIndexOf("_")),
                    nextSlide = this.imageContainer.querySelector(`.product-block--slide[src^="${imageUrlStart}"]`);
                if (nextSlide) {
                    const currentSlide = this.imageContainer.querySelector(".product-block--slide.-in");
                    currentSlide && currentSlide.classList.remove("-in"), this.imageContainer.querySelector(".image__first").classList.add("-out"), nextSlide.classList.add("-in")
                } else console.warn("No next slide for ", imageUrlStart)
            }
            preloadImage(imageUrl) {
                if (!this.preloadedImages.includes(imageUrl)) {
                    const imageElem = new Image;
                    imageElem.src = imageUrl, this.preloadedImages.push(imageUrl)
                }
            }
            getImageUrl(url) {
                const imageContainerWidth = theme.device.isRetinaDisplay() ? this.productBlock.clientWidth * 2 : this.productBlock.clientWidth;
                for (let i2 = 0; i2 < this.widths.length; i2++)
                    if (this.widths[i2] >= imageContainerWidth) return this.imageWidth = this.widths[i2], url.replace("{width}", this.widths[i2])
            }
            initImageSlider() {
                if (this.productBlock) {
                    const allImages = this.productBlock.dataset.productImages;
                    if (allImages && !this.imageSliderLoaded) {
                        const allImagesArr = allImages.split(",");
                        let sliderHtml = "";
                        allImagesArr.forEach(image => {
                            sliderHtml += `<img class="product-block--slide" tabindex="-1" src="${this.getImageUrl(image)}"/>`
                        }), this.imageContainer.insertAdjacentHTML("beforeend", sliderHtml), this.imageSliderLoaded = !0
                    }
                }
            }
            destroyImageSlider() {
                if (this.imageSliderLoaded) {
                    const slides = this.imageContainer.querySelectorAll(".product-block--slide");
                    slides && slides.forEach(slide => {
                        slide.remove()
                    }), this.imageSliderLoaded = !1
                }
            }
            handleMouseEnterSwatch(e) {
                if (e.target.dataset.variantImage) {
                    this.imageSliderLoaded || this.initImageSlider();
                    const newUrl = this.getImageUrl(e.target.dataset.variantImage);
                    this.showSpecificSlideImage(newUrl)
                }
            }
            handleMouseLeaveSwatch(e) {
                const currentSlide = this.imageContainer.querySelector(".product-block--slide.-in");
                currentSlide && currentSlide.classList.remove("-in"), this.imageContainer.querySelector(".image__first").classList.remove("-out")
            }
            handleClickSwatch(e) {
                e.preventDefault()
            }
            handleMouseEnterProductBlock(e) {
                this.swatchImagesPreloaded || (this.productBlock.querySelectorAll(".cc-swatches a").forEach(swatch => {
                    swatch.dataset.variantImage && this.preloadImage(this.getImageUrl(swatch.dataset.variantImage))
                }), this.swatchImagesPreloaded = !0), this.productBlock.dataset.productImages && !this.imageSliderLoaded && (this.productBlock.classList.contains("all-images") ? this.initImageSlider() : setTimeout(this.initImageSlider, 500))
            }
            handleEnterImageContainer(e) {
                this.productBlock.classList.contains("all-images") && (this.showNextSlideImage(), this.initImageSliderLoadingBar())
            }
            handleLeaveImageContainer(e) {
                if (clearTimeout(this.hoverTimeout), this.imageSliderLoaded) {
                    const activeSlide = this.imageContainer.querySelector(".product-block--slide.-in");
                    activeSlide && (activeSlide.classList.remove("-in"), this.imageContainer.querySelector(".image__first").classList.remove("-out")), this.destroyImageSliderLoadingBar()
                }
            }
            initImageSliderLoadingBar() {
                let transitionDuration = this.imageContainer.querySelectorAll(".product-block--slide").length * this.slideDuration - 100;
                const loadingBar = document.createElement("div");
                loadingBar.classList.add("loading-bar"), loadingBar.style.transitionDuration = transitionDuration + "ms", this.productBlockImageContainer.append(loadingBar), setTimeout(() => {
                    loadingBar.classList.add("-in")
                }, 100)
            }
            destroyImageSliderLoadingBar() {
                const loadingBar = this.productBlockImageContainer.querySelector(".loading-bar");
                loadingBar && loadingBar.remove()
            }
            handleWindowResize() {
                if (this.imageWidth && this.productBlock.clientWidth > this.imageWidth) {
                    for (let i2 = 0; i2 < this.widths.length; i2++)
                        if (this.widths[i2] >= this.productBlock.clientWidth && this.widths[i2] > this.imageWidth) {
                            this.destroyImageSlider();
                            break
                        }
                }
            }
            handlePageHide() {
                this.mouseLeaveImageContainerHandler.call(this)
            }
            bindEvents() {
                this.focusSwatchHandler = this.handleMouseEnterSwatch.bind(this), this.mouseEnterSwatchHandler = theme.debounce(this.handleMouseEnterSwatch.bind(this), 150), this.mouseLeaveSwatchHandler = theme.debounce(this.handleMouseLeaveSwatch.bind(this), 150), this.touchDeviceClickHandler = this.handleClickSwatch.bind(this), this.mouseEnterProductBlockHandler = this.handleMouseEnterProductBlock.bind(this), this.mouseEnterImageContainerHandler = this.handleEnterImageContainer.bind(this), this.mouseLeaveImageContainerHandler = this.handleLeaveImageContainer.bind(this), this.windowResizeHandler = theme.debounce(this.handleWindowResize.bind(this)), this.pageHideHandler = this.handlePageHide.bind(this), this.productBlock.querySelectorAll(".cc-swatches a").forEach(swatch => {
                    swatch.addEventListener("mouseenter", this.mouseEnterSwatchHandler), swatch.addEventListener("focus", this.focusSwatchHandler), this.swatches.push(swatch), theme.device.isTouch() && swatch.addEventListener("click", this.touchDeviceClickHandler)
                }), this.swatchesContainer && this.swatchesContainer.addEventListener("mouseleave", this.mouseLeaveSwatchHandler), (window.innerWidth >= 768 || Shopify.designMode) && (this.productBlock.addEventListener("mouseenter", this.mouseEnterProductBlockHandler), this.imageContainer.addEventListener("mouseenter", this.mouseEnterImageContainerHandler), this.imageContainer.addEventListener("mouseleave", this.mouseLeaveImageContainerHandler)), window.addEventListener("resize", this.windowResizeHandler), window.addEventListener("pagehide", this.pageHideHandler)
            }
            destroy() {
                this.swatches.forEach(swatch => {
                    swatch.removeEventListener("mouseenter", this.mouseEnterSwatchHandler), swatch.removeEventListener("click", this.touchDeviceClickHandler)
                }), this.productBlock.removeEventListener("mouseenter", this.mouseEnterProductBlockHandler), this.productBlock.removeEventListener("mouseenter", this.mouseEnterImageContainerHandler), this.productBlock.removeEventListener("mouseleave", this.mouseLeaveImageContainerHandler), window.removeEventListener("resize", this.windowResizeHandler), window.removeEventListener("pagehide", this.pageHideHandler), this.swatchesContainer && this.swatchesContainer.removeEventListener("mouseleave", this.mouseLeaveSwatchHandler)
            }
        }
        class ProductBlock extends ccComponent {
            constructor() {
                let name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "product-block",
                    cssSelector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : `.cc-${name}:not(.cc-initialized)`;
                super(name, cssSelector)
            }
            init(container) {
                super.init(container), this.registerInstance(container, new ProductBlockInstance(container))
            }
            destroy(container) {
                this.destroyInstance(container), super.destroy(container)
            }
        }
        new ProductBlock, theme.HeaderSection = new function() {
            let c, currentScrollTop = 0;
            const default_threshold = 100,
                $announcementBar = $(".cc-announcement");
            handleScroll = function(nav, positioning, opacity) {
                opacity === "opaque_on_scroll" || opacity === "opaque_on_scroll_alt" ? $(window).scrollTop() < 100 ? nav.bar.turnOpaque(!1) : nav.bar.turnOpaque(!0) : opacity !== "opaque" && nav.bar.turnOpaque(!1);
                var scrollTop = $(window).scrollTop();
                (positioning === "peek" || nav.bar.isAnnouncementBar() && positioning == "sticky") && scrollTop > 100 ? (currentScrollTop = scrollTop, positioning != "sticky" && (c < currentScrollTop && scrollTop > default_threshold ? nav.bar.hide(!0) : c > currentScrollTop && !(scrollTop <= 50) && nav.bar.hide(!1)), c = currentScrollTop) : nav.bar.hide(!1), (positioning == "sticky" || positioning == "peek") && $announcementBar.length > 0 && (scrollTop <= 50 ? nav.bar.hideAnnouncement(!1) : nav.bar.hideAnnouncement(!0))
            }, this.onSectionLoad = function(target) {
                theme.addControlPaddingToModal(), $("body").toggleClass("modal-active", $(".theme-modal.reveal").length > 0), $("#page-menu a", target).attr("tabindex", "-1"), $("#page-menu .main-nav li:has(ul)", target).addClass("has-children"), $("#page-menu.nav-uses-modal .main-nav li.has-children > a", target).append('<span class="arr">' + theme.icons.chevronRight + "</span>"), $(".disclosure", target).each(function() {
                    $(this).data("disclosure", new theme.Disclosure($(this)))
                });
                const nav = new theme.Nav,
                    positioning = nav.bar.getPositionSetting(),
                    opacity = nav.bar.getOpacitySetting();
                if (opacity === "opaque" ? $("body").addClass("nav-opaque") : $("body").removeClass("nav-opaque"), positioning === "inline" ? $("body").addClass("nav-inline") : $("body").removeClass("nav-inline"), opacity !== "opaque" ? $("body").addClass("nav-transparent") : $("body").removeClass("nav-transparent"), nav.bar.isAnnouncementBar() ? $("body").addClass("showing-announcement") : $("body").removeClass("showing-announcement"), (opacity === "opaque_on_scroll" || opacity === "opaque_on_scroll_alt" || positioning === "peek" || nav.bar.isAnnouncementBar()) && (currentScrollTop = 0, $(window).on("throttled-scroll.nav", function() {
                        handleScroll(nav, positioning, opacity)
                    })), $(document).on("click.video-section", ".video-container__play", function() {
                        theme.viewport.isXs() && nav.bar.fadeOut(!0)
                    }), $(document).on("click.video-section", ".video-container__stop", function() {
                        theme.viewport.isXs() && nav.bar.fadeOut(!1)
                    }), nav.bar.hasInlineLinks() && nav.bar.hasLocalization()) {
                    let doNavResizeEvents2 = function() {
                        theme.viewport.isXlg() && $toolbarRight.width() > $logo.width() ? $logo.css("width", $toolbarRight.outerWidth() - 20 + "px") : $logo.css("width", "")
                    };
                    var doNavResizeEvents = doNavResizeEvents2;
                    const $logo = $(".logo", target),
                        $toolbarRight = $(".nav-right-side", target);
                    $(window).on("debouncedresize.headerSection doNavResizeEvents.headerSection", doNavResizeEvents2).trigger("doNavResizeEvents");
                    const event = new CustomEvent("cc-header-updated");
                    window.dispatchEvent(event)
                }
                setTimeout(function() {
                    $(".lazyload--manual", target).removeClass("lazyload--manual").addClass("lazyload")
                }, 5e3), theme.checkViewportFillers(), theme.assessAltLogo(), $(window).trigger("cc-header-updated")
            }, this.onSectionUnload = function(target) {
                $(".disclosure", target).each(function() {
                    $(this).data("disclosure").unload()
                }), $(window).off("throttled-scroll.nav"), $(window).off("headerSection"), $(document).on("click.video-section")
            }
        }, theme.FooterSection = new function() {
            this.onSectionLoad = function(container) {
                this.footerSectionElem = container.parentElement, $(".disclosure", container).each(function() {
                    $(this).data("disclosure", new theme.Disclosure($(this)))
                }), this.observer = new MutationObserver(this.functions.observeMutation.bind(this)), container.querySelectorAll(".disclosure__toggle").forEach(disclosureToggle => {
                    this.observer.observe(disclosureToggle, {
                        attributes: !0
                    })
                })
            }, this.onSectionUnload = function(container) {
                $(".disclosure", container).each(function() {
                    $(this).data("disclosure").unload()
                }), this.observer.disconnect()
            }, this.functions = {
                observeMutation: function(mutations) {
                    mutations.forEach(mutation => {
                        mutation.type === "attributes" && mutation.attributeName === "aria-expanded" && this.footerSectionElem.classList.toggle("disclosure--open", mutation.target.getAttribute("aria-expanded") === "true")
                    })
                }
            }
        }, theme.SlideshowSection = new function() {
            this.onSectionLoad = function(target) {
                theme.initContentSlider(target), $(window).trigger("slideshowfillheight"), theme.checkViewportFillers(), theme.assessAltLogo()
            }, this.onSectionUnload = function(target) {
                $(".slick-slider", target).slick("unslick").off("init"), $(window).off(".slideshowSection")
            }, this.onBlockSelect = function(target) {
                $(target).closest(".slick-slider").slick("slickGoTo", $(target).data("slick-index")).slick("slickPause")
            }, this.onBlockDeselect = function(target) {
                $(target).closest(".slick-slider").slick("slickPlay")
            }
        }, theme.FeaturedBlogSection = new function() {
            this.onSectionLoad = function(target) {
                if ($(".carousel-blog", target).length) {
                    const $swiperCont = $(".swiper-container", target);
                    $swiperCont.length === 1 && theme.initProductSlider($swiperCont, !0)
                }
                if ($(".slideshow-blog", target).length) {
                    theme.initContentSlider(target, function(slide) {
                        $(".slideshow-blog__titles__active", target).removeClass("slideshow-blog__titles__active"), $(`[data-go-to-slide="${slide}"]`, target).parent().addClass("slideshow-blog__titles__active")
                    });
                    const $slideshowTitles = $(".slideshow-blog__titles", target);
                    if ($('.slideshow[data-title-navigation="true"]', target).length) {
                        let checkTitleNavHeight2 = function() {
                            theme.viewport.isSm() ? $(".overlay-type .inner", target).css("padding-bottom", $slideshowTitles.height() + 50 + "px") : $(".overlay-type .inner", target).removeAttr("style")
                        };
                        var checkTitleNavHeight = checkTitleNavHeight2;
                        checkTitleNavHeight2(), $(window).on("debouncedresize.titleNavHeight", checkTitleNavHeight2), $("[data-go-to-slide]", target).on("click", function() {
                            const slideNum = $(this).data("go-to-slide");
                            return $(".slideshow", target).slick("slickGoTo", slideNum).slick("slickPause"), $(".slideshow-blog", target).addClass("slideshow--paused"), !1
                        }), $("[data-go-to-slide]:first", target).parent().addClass("slideshow-blog__titles__active")
                    }
                    $(window).trigger("slideshowfillheight")
                }
                theme.checkViewportFillers(), theme.assessAltLogo()
            }, this.onSectionUnload = function(target) {
                $(".slick-slider", target).slick("unslick").off("init"), $(window).off("debouncedresize.titleNavHeight"), $("[data-go-to-slide]", target).off("click")
            }
        }, theme.ImageWithTextOverlay = new function() {
            var _ = this;
            _.checkTextOverImageHeights = function() {
                $('[data-section-type="image-with-text-overlay"], [data-nested-section-type="image-with-text-overlay"]').each(function() {
                    var $imageContainer = $(".rimage-outer-wrapper", this),
                        imageHeight = $(".rimage-wrapper", this).outerHeight(),
                        textVerticalPadding = parseInt($(".overlay", this).css("padding-top")),
                        textHeight = $(".overlay__content", this).height() + textVerticalPadding * 2;
                    textHeight > imageHeight + 2 ? $imageContainer.css("height", textHeight) : $imageContainer.css("height", "")
                })
            }, this.onSectionLoad = function(target) {
                $(window).off(".imageWithTextOverlaySection"), $(".overlay__content", target).length && ($(_.checkTextOverImageHeights), $(window).on("debouncedresize.imageWithTextOverlaySection", _.checkTextOverImageHeights)), theme.checkViewportFillers()
            }, this.onSectionUnload = function(target) {
                $(window).off(".imageWithTextOverlaySection")
            }
        }, theme.ImageBesideImageSection = new function() {
            var _ = this;
            _.checkTextOverImageHeights = function() {
                $(".image-beside-image__image").each(function() {
                    var $imageContainer = $(".rimage-outer-wrapper", this),
                        imageHeight = $(".rimage-wrapper", this).outerHeight(),
                        textVerticalPadding = parseInt($(".overlay", this).css("padding-top")),
                        textHeight = $(".overlay__content", this).height() + textVerticalPadding * 2;
                    textHeight > imageHeight + 2 ? $imageContainer.css("height", textHeight) : $imageContainer.css("height", "")
                })
            }, this.onSectionLoad = function(target) {
                $(window).off(".imageBesideImageSection"), $(".overlay__content", target).length && ($(_.checkTextOverImageHeights), $(window).on("debouncedresize.imageBesideImageSection", _.checkTextOverImageHeights)), theme.checkViewportFillers()
            }, this.onSectionUnload = function(target) {
                $(window).off(".imageBesideImageSection")
            }
        }, theme.ProductTemplateSection = new function() {
            const nav = theme.Nav();
            let galleries = {};
            this.onSectionLoad = function(target) {
                let isQuickbuy = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
                const sectionUniqueId = new Date().getTime();
                $(target).attr("data-section-id", sectionUniqueId);
                const isFeaturedProduct = $(target).data("is-featured-product") || !1;
                !isFeaturedProduct && !isQuickbuy && $("[data-store-availability-container]", target).length && (this.storeAvailability = new theme.StoreAvailability($("[data-store-availability-container]", target)[0])), theme.checkViewportFillers(), theme.assessAltLogo(), nav.bar.isCurrentlyOpaque() && !isFeaturedProduct && !isQuickbuy && $("body").removeClass("header-section-overlap");
                const $gallery = $(".theme-gallery", target);
                if ($gallery.length > 0 && (galleries[sectionUniqueId] = new theme.ProductMediaGallery($gallery, $(".theme-gallery-thumb", target), isFeaturedProduct, isQuickbuy, sectionUniqueId)), !isFeaturedProduct) {
                    let resizeProductDetails2 = function() {
                        theme.viewport.isXs() && !stickyAddToCartInitialised && !isQuickbuy && ($(window).on("throttled-scroll.sticky-add-to-cart", function() {
                            productSection.getBoundingClientRect().bottom < $(window).outerHeight() ? stickyAddToCartIsUnstuck || ($stickyAddToCart.addClass("-out"), stickyAddToCartIsUnstuck = !0) : stickyAddToCartIsUnstuck && ($stickyAddToCart.removeClass("-out"), stickyAddToCartIsUnstuck = !1)
                        }), $(".product-area__add-to-cart-xs button", target).on("click", function(e) {
                            document.querySelector('.product-detail__form button[type="submit"]').click()
                        }), stickyAddToCartInitialised = !0)
                    };
                    var resizeProductDetails = resizeProductDetails2;
                    const $stickyAddToCart = $(".product-area__add-to-cart-xs", target);
                    let stickyAddToCartInitialised = !$stickyAddToCart.length,
                        stickyAddToCartIsUnstuck = !1;
                    const productSection = $(".section-product-template")[0];
                    $(window).on(`debouncedresizewidth.productDetails${sectionUniqueId}`, resizeProductDetails2), $(window).on(`cc-header-updated.productDetails${sectionUniqueId}`, resizeProductDetails2), $(window).on(`shopify:section:reorder.productDetails${sectionUniqueId}`, resizeProductDetails2), resizeProductDetails2()
                }
                theme.convertOptionsToBoxes(target), theme.OptionManager.initProductOptions($(target)), $("select:not(.original-selector)").selectReplace().closest(".selector-wrapper").addClass("has-pretty-select"), $(".size-chart-link", target).on("click", function() {
                    return $.colorbox({
                        inline: !0,
                        fixed: !0,
                        maxHeight: "80%",
                        title: "\uC0AC\uC774\uC988 \uAC00\uC774\uB4DC",
                        href: "#size-chart-content > .size-chart"
                    }), !1
                }), document.addEventListener("openRestockPopup", () => ($.colorbox({
                    inline: !0,
                    fixed: !0,
                    maxHeight: "80%",
                    title: "\uC785\uACE0 \uC54C\uB9BC \uC2E0\uCCAD\uD558\uAE30",
                    href: "#notification-content > .notification",
                    onOpen: () => {
                        document.dispatchEvent(new Event("restockNotification"))
                    }
                }), !1)), document.addEventListener("updatePopupData", () => {
                    $("#cboxLoadedContent").html($("#notification-content > .notificationConfirm").html())
                }), $(document).on("click", "#cboxCustomClose", function() {
                    $.colorbox.close()
                }), $(window).on(`cc-variant-updated.product-swatches${sectionUniqueId}`, (e, args) => {
                    const $swatchesContainer = $(".cc-swatches", target);
                    $swatchesContainer.length && ($swatchesContainer.find(".cc-swatches__label").remove(), $swatchesContainer.find("label.color-labels").append(`<span class="cc-swatches__label">${$swatchesContainer.find(".active").text()}</span>`))
                }), theme.initAnimateOnScroll(), theme.checkViewportFillers(), theme.initShopifyPaymentButtons($(target))
            }, this.onSectionUnload = function(target, isQuickbuy) {
                const sectionUniqueId = $(target).attr("data-section-id");
                isQuickbuy || $(window).off("throttled-scroll.sticky-add-to-cart"), $(window).off(`.productDetails${sectionUniqueId}`), $(window).off(`cc-variant-updated.product-swatches${sectionUniqueId}`), $(".spr-container", target).off("click"), $(".theme-gallery-thumb", target).off("click"), $(".size-chart-link", target).off("click"), $(".product-area__add-to-cart-xs button", target).off("click"), theme.OptionManager.unloadProductOptions($(target)), galleries[sectionUniqueId] ? galleries[sectionUniqueId].destroy() : console.warn("No galleries found"), this.storeAvailability && !isQuickbuy && this.storeAvailability.onSectionUnload()
            }
        }, theme.ProductTemplateCalendarSection = new function() {
            document.addEventListener("openRestockPopup", () => ($.colorbox({
                inline: !0,
                fixed: !0,
                maxHeight: "80%",
                title: "\uC785\uACE0 \uC54C\uB9BC \uC2E0\uCCAD\uD558\uAE30",
                href: "#notification-content > .notification",
                onOpen: () => {
                    document.dispatchEvent(new Event("restockNotification"))
                }
            }), !1)), document.addEventListener("updatePopupData", () => {
                $("#cboxLoadedContent").html($("#notification-content > .notificationConfirm").html())
            }), document.addEventListener("openLaunchCalendarPopup", () => ($.colorbox({
                inline: !0,
                fixed: !0,
                maxHeight: "80%",
                title: "\uC785\uACE0 \uC54C\uB9BC \uC2E0\uCCAD\uD558\uAE30",
                href: "#launch-calendar-notification-content > .notification",
                onOpen: () => {
                    document.dispatchEvent(new Event("launchCalendarNotification"))
                }
            }), !1)), document.addEventListener("updateLaunchCalendarPopup", () => {
                $("#cboxLoadedContent").html($("#launch-calendar-notification-content > .notificationConfirm").html())
            }), document.addEventListener("openEventPopup", () => ($.colorbox({
                inline: !0,
                fixed: !0,
                maxHeight: "80%",
                title: "\uB798\uD50C \uC2E0\uCCAD\uD558\uAE30",
                href: "#event-notification-content > .notification",
                onOpen: () => {
                    document.dispatchEvent(new Event("eventNotification"))
                }
            }), !1)), document.addEventListener("updateEventPopupData", () => {
                $("#cboxLoadedContent").html($("#event-notification-content > .notificationConfirm").html())
            }), document.addEventListener("openRafflePopup", () => ($.colorbox({
                inline: !0,
                fixed: !0,
                maxHeight: "80%",
                title: "\uB798\uD50C \uC2E0\uCCAD\uD558\uAE30",
                href: "#raffle-notification-content > .notification",
                onOpen: () => {
                    document.dispatchEvent(new Event("raffleNotification"))
                }
            }), !1)), document.addEventListener("updateRafflePopupData", () => {
                $("#cboxLoadedContent").html($("#raffle-notification-content > .notificationConfirm").html())
            }), $(document).on("click", "#cboxCustomClose", function() {
                $.colorbox.close()
            })
        }, theme.FilterManager = new function() {
            this.onSectionLoad = function(container) {
                this.namespace = theme.namespaceFromSection(container), this.$container = $(container), this.$container.data("ajax-filtering") ? (this.$container.on("click" + this.namespace, ".pagination a,.active-filter-controls a", this.functions.ajaxLoadLink.bind(this)), this.$container.on("change" + this.namespace + " submit" + this.namespace, "#FacetsForm", theme.debounce(this.functions.ajaxLoadForm.bind(this), 700)), this.registerEventListener(window, "popstate", this.functions.ajaxPopState.bind(this))) : this.$container.on("change" + this.namespace, "#FacetsForm", this.functions.submitForm), this.$container.on("click" + this.namespace, "[data-show-filter]", this.functions.toggleFilter.bind(this)), this.$container.on("submit" + this.namespace, "#search-page-form", this.functions.updateSearchQuery.bind(this)), theme.loadInfiniteScroll(container), this.functions.refreshSelects()
            }, this.onSectionUnload = function(container) {
                this.$container.off(this.namespace), $(window).off(this.namespace), $(document).off(this.namespace), theme.unloadInfiniteScroll()
            }, this.functions = {
                submitForm: function(e) {
                    e.currentTarget.submit()
                },
                updateSearchQuery: function(e) {
                    const $form = this.$container.find("#FacetsForm");
                    $form.length && (e.preventDefault(), $form.find('[name="q"]').val($(e.currentTarget).find('[name="q"]').val()), this.$container.data("ajax-filtering") ? this.functions.ajaxLoadForm.bind(this)({
                        type: null,
                        currentTarget: $form[0]
                    }) : $form.submit())
                },
                toggleFilter: function() {
                    const $filterBtn = $("[data-show-filter]", this.$container),
                        $productFilter = $(".cc-product-filter", this.$container),
                        nav = theme.Nav();
                    return $productFilter.hasClass("-in") ? (nav.bar.fadeOut(!1), $("[data-footer-reset-button]").css("display", "none"), $("body").css("overflow", "auto")) : (nav.bar.fadeOut(!0), $("[data-footer-reset-button]").css("display", "block"), $("body").css("overflow", "hidden")), $productFilter.toggleClass("-in"), !1
                },
                ajaxLoadLink: function(evt) {
                    evt.preventDefault(), this.functions.ajaxLoadUrl.call(this, $(evt.currentTarget).attr("href"))
                },
                ajaxLoadForm: function(evt) {
                    evt.type === "submit" && evt.preventDefault();
                    let queryVals = [];
                    evt.currentTarget.querySelectorAll("input, select").forEach(input => {
                        (input.type !== "checkbox" && input.type !== "radio" || input.checked) && input.value !== "" && (input.value === "" && input.dataset.currentValue ? queryVals.push([input.name, encodeURIComponent(input.dataset.currentValue)]) : queryVals.push([input.name, encodeURIComponent(input.value)]))
                    }), evt.currentTarget.querySelectorAll("[data-current-value]").forEach(input => {
                        input.setAttribute("value", input.dataset.currentValue)
                    });
                    const data = new FormData(evt.currentTarget),
                        queryString = new URLSearchParams(data).toString();
                    this.functions.ajaxLoadUrl.call(this, "?" + queryString)
                },
                ajaxPopState: function(event) {
                    this.functions.ajaxLoadUrl.call(this, document.location.href, !0)
                },
                initFilterResults: function() {
                    theme.loadInfiniteScroll(this.container), theme.inlineVideos.init(this.container), theme.initAnimateOnScroll();
                    const $components = this.$container.closest("[data-components]");
                    $components.length && $components.data("components").split(",").forEach(function(component) {
                        $(document).trigger("cc:component:load", [component, $components[0]])
                    }.bind(this))
                },
                refreshSelects: function() {
                    $("select:not(.original-selector)", this.$container).selectReplace().closest(".selector-wrapper").addClass("has-pretty-select"), document.getElementById("Filter-filter.v.availability-0") && (document.getElementById("Filter-filter.v.availability-0").parentElement.style.display = "none")
                },
                ajaxLoadUrl: function(url, noPushState) {
                    const _this = this;
                    if (!noPushState) {
                        var fullUrl = url;
                        fullUrl.slice(0, 1) === "/" && (fullUrl = window.location.protocol + "//" + window.location.host + fullUrl), window.history.pushState({
                            path: fullUrl
                        }, "", fullUrl)
                    }
                    let refreshContainerSelector = "[data-ajax-container]",
                        $ajaxContainers = this.$container.find(refreshContainerSelector);
                    $ajaxContainers.addClass("cc-product-filter-container--loading"), $ajaxContainers.find(".product-list").append(`<span class="loading" aria-label="${theme.strings.loading}">${theme.icons.loading} </span>`), theme.unloadInfiniteScroll(this.$container), theme.inlineVideos.destroy(this.$container), this.currentAjaxLoadUrlFetch && this.currentAjaxLoadUrlFetch.abort(), this.currentAjaxLoadUrlFetch = $.get(url, function(data) {
                        this.currentAjaxLoadUrlFetch = null, document.activeElement && (this.activeElementId = document.activeElement.id), $(`<div>${data}</div>`).find(refreshContainerSelector).each(function(index) {
                            const $newAjaxContainer = $(this);
                            $($ajaxContainers[index]).find(".cc-accordion-item").each(function() {
                                const accordionIndex = $(this).closest(".cc-accordion").index();
                                $(this).hasClass("is-open") ? $newAjaxContainer.find(`.cc-accordion:nth-child(${accordionIndex+1}) .cc-accordion-item`).addClass("is-open").attr("open", "") : $newAjaxContainer.find(`.cc-accordion:nth-child(${accordionIndex+1}) .cc-accordion-item`).removeClass("is-open").removeAttr("open")
                            }), $(".cc-product-filter", _this.$container).length && $(".cc-product-filter", _this.$container).hasClass("-in") && $newAjaxContainer.find(".cc-product-filter").addClass("-in"), $($ajaxContainers[index]).html($newAjaxContainer.html()), _this.functions.refreshSelects()
                        }), this.functions.initFilterResults.call(this);
                        const $filterSidebar = $(".cc-product-filter", _this.$container),
                            $filterBtn = $("[data-show-filter]", _this.$container);
                        if ($filterSidebar.length && $filterSidebar.hasClass("-in")) {
                            let buttonText, resultCount = $(".product-list", _this.$container).data("result-count");
                            resultCount === 1 ? buttonText = $filterBtn.data("result-count-text-singular").replace("[x]", resultCount) : buttonText = $filterBtn.data("result-count-text").replace("[x]", resultCount), $filterBtn.text(buttonText)
                        }
                        if ($ajaxContainers.removeClass("cc-product-filter-container--loading"), this.activeElementId) {
                            let el = document.getElementById(this.activeElementId);
                            el && el.focus()
                        }
                        let matchingTags = $("[data-collection-tags]").attr("data-collection-tags");
                        matchingTags ? $('input[name="filter.p.tag"]').each(function(index, value) {
                            let inputValue = $(value).val(),
                                parentElement = $(value).parent(),
                                tagsArray = matchingTags.split(","),
                                tagMatches = !1;
                            tagsArray.forEach(tag => {
                                if (tag.trim() === inputValue.trim()) return tagMatches = !0, !1
                            }), tagMatches ? (parentElement.removeClass("hidden"), parentElement.css("display", "block")) : (parentElement.addClass("hidden"), parentElement.css("display", "none"))
                        }) : $('input[name="filter.p.tag"]').each(function(index, value) {
                            let parentElement = $(value).closest(".cc-accordion.cc-initialized");
                            parentElement.addClass("hidden"), parentElement.css("display", "none")
                        }), $("[data-footer-reset-button]").css("display", "block"), $(document).on("mouseenter", "[data-product-main-block]", function() {
                            $(this).find(".as-collection__imageSwatchWrap").length > 0 || ($(this).find(".caption, .as-productColors, .as-collection__badgeWrap").css({
                                opacity: 1,
                                visibility: "visible"
                            }), $(this).find(".as-collection__imageSwatchWrap").css({
                                opacity: 0,
                                visibility: "hidden"
                            }))
                        }), $("[data-product-wishlist-id]").each(function(index, item) {
                            var productID = parseInt($(item).data("product-wishlist-id"), 10),
                                userID = parseInt($(item).data("customer-wishlist-id"), 10);
                            productID && userID && getWishlist(productID, userID)
                        });
                        const $resultContainer = $("[data-ajax-scroll-to]:first", this.$container);
                        $(window).scrollTop() - 200 > $resultContainer.offset().top && theme.viewport.scroll.to($resultContainer, -1, 25)
                    }.bind(this))
                }
            }
        }, theme.ListCollectionsSection = new function() {
            this.onSectionLoad = function(target) {}
        }, theme.BlogTemplateSection = new function() {
            this.onSectionLoad = function(target) {
                $("select").selectReplace(), theme.allowRTEFullWidthImages(target)
            }
        }, theme.ArticleTemplateSection = new function() {
            this.onSectionLoad = function(target) {
                theme.checkViewportFillers(), theme.assessAltLogo(), theme.allowRTEFullWidthImages(target)
            }
        }, theme.CartTemplateSection = new function() {
            this.onSectionLoad = function(target) {
                theme.cartNoteMonitor.load($('#cartform [name="note"]', target)), $("#cartform input#terms", target).length > 0 && $(document).on("click.cartTemplateSection", '#cartform [name="checkout"]:submit, .additional-checkout-buttons :submit, .additional-checkout-buttons input[type=image], a[href="/checkout"]', function() {
                    if ($("#cartform input#terms:checked").length == 0) return alert(theme.strings.cartConfirmation), !1
                })
            }, this.onSectionUnload = function(target) {
                theme.cartNoteMonitor.unload($('#cartform [name="note"]', target)), $(document).off(".cartTemplateSection")
            }
        }, theme.CollectionListSection = new function() {
            this.onSectionLoad = function(target) {
                const $swiperCont = $(".swiper-container", target);
                $swiperCont.length === 1 && theme.initProductSlider($swiperCont)
            }
        }, theme.FeaturedCollectionSection = new function() {
            this.onSectionLoad = function(target) {
                const $swiperCont = $(".swiper-container", target);
                $swiperCont.length === 1 && theme.initProductSlider($swiperCont)
            }
        }, theme.ProductRecommendations = new function() {
            this.onSectionLoad = function(container) {
                var productRecommendationsSection = document.querySelector(".product-recommendations");
                if (productRecommendationsSection !== null) {
                    var request = new XMLHttpRequest;
                    request.open("GET", productRecommendationsSection.dataset.url, !0), request.onload = function() {
                        if (request.status >= 200 && request.status < 300) {
                            var container2 = document.createElement("div");
                            container2.innerHTML = request.response, productRecommendationsSection.innerHTML = container2.querySelector(".product-recommendations").innerHTML, theme.initAnimateOnScroll();
                            const $swiperCont = $(".section-product-recommendations .swiper-container");
                            $swiperCont.length === 1 ? (theme.initProductSlider($swiperCont), setTimeout(() => {
                                theme.inlineVideos.init(productRecommendationsSection.parentElement), new ProductBlock
                            }, 500)) : console.warn("Unable to find .section-product-recommendations")
                        }
                    }, request.send()
                }
            }, this.onSectionUnload = function(container) {
                theme.inlineVideos.destroy(container)
            }
        }, theme.GallerySection = new function() {
            this.onSectionLoad = function(container) {
                var $carouselGallery = $(".gallery--mobile-carousel", container);
                if ($carouselGallery.length) {
                    var assessCarouselFunction = function() {
                        var isCarousel = $carouselGallery.hasClass("slick-slider"),
                            shouldShowCarousel = theme.viewport.isXs();
                        if (shouldShowCarousel || $(".lazyload--manual", $carouselGallery).removeClass("lazyload--manual").addClass("lazyload"), isCarousel && !shouldShowCarousel) {
                            $carouselGallery.slick("unslick").off("init"), $carouselGallery.removeAttr("data-transition"), $carouselGallery.removeClass("slideshow"), $carouselGallery.find("a, .gallery__item").removeAttr("tabindex").removeAttr("role");
                            var rowLimit = $carouselGallery.data("grid"),
                                $currentRow = null;
                            $carouselGallery.find(".gallery__item").each(function(index) {
                                index % rowLimit === 0 && ($currentRow = $('<div class="gallery__row">').appendTo($carouselGallery)), $(this).appendTo($currentRow)
                            })
                        } else !isCarousel && shouldShowCarousel && ($carouselGallery.find("[data-cc-animate]").removeAttr("data-cc-animate"), $carouselGallery.find(".gallery__item").appendTo($carouselGallery).addClass("slide"), $carouselGallery.find(".gallery__row").remove(), $carouselGallery.attr("data-transition", "slide"), $carouselGallery.addClass("slideshow"), $carouselGallery.on("init", function() {
                            $(".lazyload--manual", this).removeClass("lazyload--manual").addClass("lazyload")
                        }).slick({
                            autoplay: !1,
                            fade: !1,
                            speed: 600,
                            infinite: !0,
                            useTransform: !0,
                            arrows: !1,
                            dots: !0,
                            cssEase: "cubic-bezier(0.25, 1, 0.5, 1)",
                            customPaging: function(slider, i2) {
                                return '<button class="custom-dot" type="button" data-role="none" role="button" tabindex="0"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" xml:space="preserve"><circle class="circle-one" cx="15" cy="15" r="13" /><circle class="circle-two" cx="15" cy="15" r="13" /></svg></button>'
                            }
                        }).on("beforeChange", function(event, slick, currentSlide, nextSlide) {
                            $(slick.$slides.get(currentSlide)).addClass("slick--leaving")
                        }).on("afterChange", function(event, slick, currentSlide) {
                            $(slick.$slides).filter(".slick--leaving").removeClass("slick--leaving")
                        }))
                    };
                    assessCarouselFunction(), $(window).on("debouncedresize.themeSection" + container.id, assessCarouselFunction)
                }
            }, this.onSectionUnload = function(container) {
                $(window).off(".themeSection" + container.id), $(".slick-slider", container).each(function() {
                    $(this).slick("unslick").off("init")
                })
            }, this.onBlockSelect = function(block) {
                $(block).closest(".slick-slider").each(function() {
                    $(this).slick("slickGoTo", $(this).data("slick-index")).slick("slickPause")
                })
            }, this.onBlockDeselect = function(block) {
                $(block).closest(".slick-slider").each(function() {
                    $(this).slick("slickPlay")
                })
            }
        }, theme.TestimonialsSection = new function() {
            let scrollax;
            this.onSectionLoad = function(container) {
                theme.settings.animationEnabledDesktop && theme.viewport.isSm() && (scrollax = new Scrollax(window).init())
            }, this.onSectionUnload = function(container) {
                scrollax && scrollax.Scrollax && scrollax.Scrollax("destroy")
            }
        }, theme.AccordionSection = new function() {
            this.onSectionLoad = function(container) {
                const event = new CustomEvent("cc-accordion-load");
                window.dispatchEvent(event)
            }, this.onBlockSelect = function(container) {
                const accordionElem = container.querySelector(".cc-accordion-item:not(.is-open) .cc-accordion-item__title");
                accordionElem && accordionElem.click()
            }, this.onSectionUnload = function(container) {
                const event = new CustomEvent("cc-accordion-unload");
                window.dispatchEvent(event)
            }
        }, theme.FaqSection = new function() {
            this.onSectionLoad = function(container) {
                this.intersectionObserver, this.namespace = theme.namespaceFromSection(container), this.container = container, this.pageContent = document.getElementById("page-content"), this.sidebar = document.getElementById("faq-sidebar"), this.accordions = this.pageContent.querySelectorAll(".cc-accordion-item__title"), this.isScrolling = !1, this.classNames = {
                    questionContainerHidden: "hidden"
                }, this.functions.initFaqSections.call(this), window.addEventListener("shopify:section:load", this.functions.delayedInitFaqSections.bind(this)), window.addEventListener("shopify:section:unload", this.functions.delayedInitFaqSections.bind(this)), window.addEventListener("shopify:section:reorder", this.functions.initFaqSections.bind(this)), this.searchInput = this.container.querySelector("#faq-search__input"), this.searchInput && (this.registerEventListener(this.searchInput, "change", this.functions.performSearch.bind(this)), this.registerEventListener(this.searchInput, "keyup", this.functions.performSearch.bind(this)), this.registerEventListener(this.searchInput, "paste", this.functions.performSearch.bind(this))), this.container.dataset.sidebarEnabled === "true" && (this.functions.initSidebar.call(this), window.addEventListener("resize", this.functions.debounceUpdateSidebarPosition), window.addEventListener("shopify:section:load", this.functions.delayedInitSidebar.bind(this)), window.addEventListener("shopify:section:unload", this.functions.delayedInitSidebar.bind(this)), window.addEventListener("shopify:section:reorder", this.functions.initSidebar.bind(this)), this.accordions.forEach(accordion => {
                    accordion.addEventListener("click", this.functions.debounceUpdateSidebarPosition)
                }), document.body.classList.add("faq-sidebar-enabled"))
            }, this.onSectionUnload = function(container) {
                this.container.dataset.sidebarEnabled === "true" && (window.removeEventListener("resize", this.functions.debounceUpdateSidebarPosition), window.removeEventListener("shopify:section:load", this.functions.delayedInitSidebar), window.removeEventListener("shopify:section:unload", this.functions.delayedInitSidebar), window.removeEventListener("shopify:section:reorder", this.functions.initSidebar), document.body.classList.remove("faq-sidebar-enabled")), window.removeEventListener("shopify:section:load", this.functions.delayedInitFaqSections), window.removeEventListener("shopify:section:unload", this.functions.delayedInitFaqSections), window.removeEventListener("shopify:section:reorder", this.functions.initFaqSections), document.querySelectorAll(".section-faq-accordion").forEach(section => {
                    section.classList.remove("section-faq-accordion")
                }), this.intersectionObserver && this.pageContent.querySelectorAll(".section-faq-accordion h2 a").forEach(accordion => this.intersectionObserver.unobserve(accordion)), this.accordions.forEach(accordion => {
                    accordion.removeEventListener("click", this.functions.updateSidebarPosition)
                }), this.pageContent.classList.remove("faq-search-active")
            }, this.functions = {
                initFaqSections: function() {
                    this.pageContent.querySelectorAll(".section-faq-accordion").forEach(section => section.classList.remove("section-faq-accordion"));
                    let foundFaqSection = !1,
                        foundNonAccordionSection = !1;
                    this.pageContent.querySelectorAll(".shopify-section").forEach(section => {
                        foundFaqSection ? section.classList.contains("section-accordion") && foundNonAccordionSection === !1 ? section.classList.add("section-faq-accordion") : foundNonAccordionSection = !0 : section.classList.contains("section-faq") && (foundFaqSection = !0)
                    })
                },
                delayedInitFaqSections: function() {
                    setTimeout(this.functions.initFaqSections.bind(this), 10)
                },
                performSearch: function() {
                    setTimeout((() => {
                        const splitValue = this.searchInput.value.toLowerCase().split(" "),
                            questionContainers = this.pageContent.querySelectorAll(".section-faq-accordion .cc-accordion");
                        let terms = [];
                        splitValue.forEach(t => {
                            t.length > 0 && terms.push(t)
                        }), terms.length > 0 ? this.pageContent.classList.add("faq-search-active") : this.pageContent.classList.remove("faq-search-active");
                        const accordionSections = this.pageContent.querySelectorAll(".section-faq-accordion");
                        accordionSections && accordionSections.forEach(accordionSection => {
                            accordionSection.classList.remove("faq-first-answer"), terms.length > 0 ? accordionSection.dataset.foundCount = "0" : accordionSection.removeAttribute("data-found-count")
                        });
                        let noResults = !0;
                        if (questionContainers.forEach((questionContainer => {
                                let foundCount = 0;
                                if (terms.length) {
                                    let termFound = !1;
                                    const matchContent = questionContainer.textContent.toLowerCase();
                                    terms.forEach(term => {
                                        matchContent.includes(term) && (noResults && questionContainer.closest(".section-accordion").classList.add("faq-first-answer"), termFound = !0, noResults = !1)
                                    }), termFound ? (questionContainer.classList.remove(this.classNames.questionContainerHidden), foundCount++) : questionContainer.classList.add(this.classNames.questionContainerHidden)
                                } else questionContainer.classList.remove(this.classNames.questionContainerHidden);
                                const sectionElem = questionContainer.closest(".section-accordion");
                                sectionElem.dataset.foundCount = parseInt(sectionElem.dataset.foundCount) + foundCount
                            }).bind(this)), noResults && terms.length ? this.container.classList.add("faq-no-results") : this.container.classList.remove("faq-no-results"), this.container.dataset.sidebarEnabled === "true") {
                            const activeSidebar = this.sidebar.querySelector(".faq-sidebar--active");
                            activeSidebar && activeSidebar.classList.remove("faq-sidebar--active"), this.sidebar.querySelectorAll("a").forEach(link => {
                                const id = link.getAttribute("href").replace("#", ""),
                                    anchorElem = document.getElementById(id);
                                anchorElem && (anchorElem.offsetParent === null ? link.classList.add("faq-sidebar--disabled") : (link.classList.remove("faq-sidebar--disabled"), this.sidebar.querySelector(".faq-sidebar--active") || link.classList.add("faq-sidebar--active")))
                            }), this.functions.updateSidebarPosition()
                        }
                    }).bind(this), 10)
                },
                initSidebar: function() {
                    let anchorHtml = "";
                    this.pageContent.querySelectorAll(".section-faq-accordion .section-heading h2").forEach((heading, index) => {
                        const label = heading.innerText,
                            anchor = "faq-" + JSON.stringify(label.toLowerCase()).replace(/[^a-zA-Z0-9\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7A3]+/g, "");
                        heading.innerHTML = `<a id="${anchor}"></a>${label}`, anchorHtml += `<li><a href="#${anchor}" ${index===0?'class="faq-sidebar--active"':""}>${label}</a></li>`
                    });
                    const nav = new theme.Nav,
                        top = nav.bar.hasStickySetting() ? nav.bar.height() + 50 : 50;
                    this.sidebar.innerHTML = `<div class="faq-sidebar__inner" style="top: ${parseInt(top)}px">
              ${this.container.dataset.sidebarTitle?"<h3>"+this.container.dataset.sidebarTitle+"</h3>":""}
              <ol>${anchorHtml}</ol>
            </div>`, this.sidebar.querySelectorAll("a").forEach(anchor => {
                        this.registerEventListener(anchor, "click", this.functions.handleIndexClick.bind(this))
                    }), "IntersectionObserver" in window && (this.intersectionObserver = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            entry.isIntersecting && !this.isScrolling && this.sidebar.querySelectorAll("a").forEach(link => {
                                link.getAttribute("href").replace("#", "") === entry.target.getAttribute("id") ? link.classList.add("faq-sidebar--active") : link.classList.remove("faq-sidebar--active")
                            })
                        })
                    }, {
                        rootMargin: "0px 0px -70%"
                    }), this.pageContent.querySelectorAll(".section-faq-accordion h2 a").forEach(accordion => this.intersectionObserver.observe(accordion))), this.functions.updateSidebarPosition()
                },
                delayedInitSidebar: function() {
                    setTimeout(this.functions.initSidebar.bind(this), 20)
                },
                updateSidebarPosition: function() {
                    const sidebar = document.getElementById("faq-sidebar"),
                        faqSection = document.querySelector(".section-faq");
                    let foundFaqSection = !1,
                        firstNonAccordionSection = null;
                    if (faqSection) {
                        document.querySelectorAll("#page-content .shopify-section").forEach(section => {
                            foundFaqSection ? firstNonAccordionSection === null && !section.classList.contains("section-accordion") && (firstNonAccordionSection = section) : section.classList.contains("section-faq") && (foundFaqSection = !0)
                        }), firstNonAccordionSection || (firstNonAccordionSection = document.querySelector(".section-footer"));
                        const faqSectionTop = faqSection.getBoundingClientRect().top + document.documentElement.scrollTop;
                        let bodyPaddingTop = window.getComputedStyle(document.body).getPropertyValue("padding-top");
                        if (bodyPaddingTop = parseInt(bodyPaddingTop.replace("px", "")), sidebar.style.top = faqSectionTop - bodyPaddingTop + "px", firstNonAccordionSection) {
                            const firstNonAccordionSectionTop = firstNonAccordionSection.getBoundingClientRect().top + document.documentElement.scrollTop;
                            sidebar.style.height = firstNonAccordionSectionTop - faqSectionTop + "px";
                            const sidebarInner = sidebar.querySelector(".faq-sidebar__inner");
                            sidebarInner && (sidebarInner.style.maxHeight = firstNonAccordionSectionTop - faqSectionTop - 100 + "px")
                        }
                    }
                },
                debounceUpdateSidebarPosition: theme.debounce(() => this.functions.updateSidebarPosition),
                handleIndexClick: function(e) {
                    e.preventDefault();
                    const activeSidebar = this.sidebar.querySelector(".faq-sidebar--active");
                    activeSidebar && activeSidebar.classList.remove("faq-sidebar--active"), e.target.classList.add("faq-sidebar--active"), this.isScrolling = !0, theme.viewport.scroll.to(e.currentTarget.getAttribute("href"), -1, 0, () => {
                        this.isScrolling = !1
                    })
                }
            }
        }, theme.ScrollingBannerSection = new function() {
            this.onSectionLoad = function(target) {
                document.fonts.ready.then(() => target.querySelector(".marquee").classList.add("marquee--animate"))
            }
        }, jQuery(function($2) {
            lazySizesConfig.minSize = 200;
            const nav = theme.Nav();
            $2("select:not(.original-selector)").selectReplace().closest(".selector-wrapper").addClass("has-pretty-select"), $2("a[rel=lightbox]").colorbox(), theme.viewport.isSm() && $2('a[rel="gallery"]').colorbox({
                rel: "gallery"
            }), $2.extend($2.colorbox.settings, {
                previous: theme.strings.colorBoxPrevious,
                next: theme.strings.colorBoxNext,
                close: theme.icons.close
            }), $2(".rte a img").closest("a").addClass("contains-img"), theme.lastViewportWidth = 0, $2(window).on("debouncedresize slideshowfillheight", function(e) {
                if (!(e.type == "debouncedresize" && theme.lastViewportWidth == $2(window).width())) {
                    var desiredHeight = $2(window).height();
                    nav.bar.isAnnouncementBar() && (desiredHeight -= nav.bar.heightOfAnnouncementBar()), $2(".slideshow.fill-viewport, .slideshow.fill-viewport .slide").css("min-height", desiredHeight), $2(".slideshow.fill-viewport").each(function() {
                        var inner = 0;
                        $2(this).find(".slide").each(function() {
                            var t = 0;
                            $2(".fill-viewport__contain", this).each(function() {
                                t += $2(this).outerHeight(!0)
                            }), inner < t && (inner = t)
                        }), inner > desiredHeight && ($2(this).css("min-height", inner), $2(".slide", this).css("min-height", inner))
                    }), theme.lastViewportWidth = $2(window).width(), $2("body.header-section-overlap").length && nav.bar.isAnnouncementBar() ? $2("#page-content").css("margin-top", nav.bar.heightOfAnnouncementBar()) : $2("#page-content").css("margin-top", "")
                }
            }), $2(window).on("scroll assessFeatureHeaders", function() {
                var scrollTop = $2(window).scrollTop(),
                    appearenceBuffer = 60,
                    windowBottom = scrollTop + $2(window).height() - appearenceBuffer;
                $2("body").toggleClass("scrolled-down", scrollTop > 0), theme.assessAltLogo(), $2(".feature-header:not(.feature-header--visible)").filter(function() {
                    var offset = $2(this).offset().top,
                        height = $2(this).outerHeight();
                    return offset + height >= scrollTop && offset <= windowBottom
                }).addClass("feature-header--visible")
            }), $2.fn.slideUpAndRemove = function() {
                let speed = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 200;
                $2(this).each(function() {
                    $2(this).slideUp(speed, function() {
                        $2(this).remove()
                    })
                })
            };
            let previousNavRoutes = ["_root"];
            updateNavCtas = function() {
                let trimmedTitle = previousNavRoutes[previousNavRoutes.length - 1],
                    $ctasToShow = $2(`#page-menu .nav-ctas__container[data-for-nav-item="${trimmedTitle}"]:hidden`);
                $ctasToShow.length > 0 ? $2("#page-menu .nav-ctas__container:visible").length ? $2("#page-menu .nav-ctas__container:visible").fadeOut(drilldownTransSpeed, function() {
                    $ctasToShow.fadeIn(drilldownTransSpeed)
                }) : setTimeout(function() {
                    $ctasToShow.fadeIn(drilldownTransSpeed)
                }, drilldownTransSpeed) : $2("#page-menu .nav-ctas__container:visible").fadeOut(drilldownTransSpeed)
            };
            var drilldownTransSpeed = 250;
            $2(document).on("click", "#page-menu.nav-uses-modal .main-nav li.has-children > a", function() {
                let trimmedTitle = $2(this).text().replace(/^\s\s*/, "").replace(/\s\s*$/, "").toLowerCase();
                previousNavRoutes.push(trimmedTitle);
                var $content = $2('<div class="container growth-area"/>').append($2(this).siblings("ul").clone().wrap('<div class="nav-body main-nav growth-area"/>').parent()),
                    $menuList = $content.find(".main-nav > ul").wrap("<li/>").parent().wrap("<ul/>").parent();
                theme.strings.back.length > 0 && ($menuList.prepend(`<li class="main-nav__title" data-nav-title="${trimmedTitle}"><a href="#">${trimmedTitle}</a></li>`), $menuList.prepend(`<li class="main-nav__back" data-nav-title="${trimmedTitle}"><a href="#" data-revert-back><span class="arr arr--left">${theme.icons.chevronLeft}</span>${theme.strings.back}</a></li>`));
                var $containers = $2("#page-menu > .inner > .nav-container > .container:not(.inactive)");
                return $containers.addClass("inactive").fadeOut(drilldownTransSpeed, function() {
                    $content.hide().insertAfter($containers.last()).fadeIn(drilldownTransSpeed), $content.closest(".theme-modal").focus()
                }), updateNavCtas(), $2("#page-menu > .inner > .nav-container > .nav-footer-links").fadeOut(drilldownTransSpeed), !1
            }), $2(document).on("click", "#page-menu.nav-uses-modal a[data-revert-back]", function() {
                return previousNavRoutes.pop(), updateNavCtas(), $2("#page-menu.nav-uses-modal > .inner > .nav-container > .container:not(.inactive)").fadeOutAndRemove(drilldownTransSpeed, function() {
                    var $menuToShow = $2("#page-menu.nav-uses-modal > .inner > .nav-container > .container.inactive:last");
                    $menuToShow.removeClass("inactive").fadeIn(drilldownTransSpeed), $menuToShow.data("root-nav") && $2("#page-menu > .inner > .nav-container > .nav-footer-links").fadeIn(drilldownTransSpeed)
                }), !1
            }), $2(document).on("reset-modal", "#page-menu.nav-uses-modal", function() {
                return closeThemeModal(), setTimeout(function() {
                    $2("#page-menu.nav-uses-modal > .inner > .nav-container > .container").removeClass("inactive").show().slice(1).remove()
                }, 300), !1
            }).on("click", "a[data-reset-and-close]", function() {
                return $2("#page-menu.nav-uses-modal").trigger("reset-modal"), !1
            }), theme.lastHoverInteractionTimestamp = -1, $2(document).on("click keydown", ".multi-level-nav .nav-rows .contains-children > a", function(e) {
                if (e.type == "click" || e.key == "Enter") return $2(this).parent().find("ul:first").slideToggle(300), !1
            }), $2(document).on(theme.device.isTouch() ? "click forceopen forceclose" : "forceopen forceclose", ".multi-level-nav .contains-mega-menu a.has-children", function(e) {
                if ($2(".nav-ctas__cta .lazyload--manual").removeClass("lazyload--manual").addClass("lazyload"), $2(this).hasClass("column-title")) return !0;
                var navAnimSpeed = 200,
                    thisInteractionTimestamp = Date.now();
                if (e.type == "click" && thisInteractionTimestamp - theme.lastHoverInteractionTimestamp < 500) return !1;
                (e.type == "forceopen" || e.type == "forceclose") && (theme.lastHoverInteractionTimestamp = thisInteractionTimestamp);
                var $tierEl = $2(this).closest('[class^="tier-"]'),
                    $tierCont = $tierEl.parent(),
                    targetTierNum = parseInt($tierEl.attr("class").split("-")[1]) + 1,
                    targetTierClass = "tier-" + targetTierNum;
                if (e.type != "forceopen" && $tierCont.children().each(function() {
                        if (parseInt($2(this).attr("class").split("-")[1]) >= targetTierNum)
                            if (e.type == "forceclose") {
                                $2(this).removeClass("tier-appeared");
                                var $this = $2(this);
                                theme.hoverRemoveTierTimeoutId = setTimeout(function() {
                                    $this.remove()
                                }, 260)
                            } else $2(this).slideUpAndRemove(navAnimSpeed)
                    }), $2(this).hasClass("expanded") && e.type != "forceopen") $2(this).removeClass("expanded").removeAttr("aria-expanded").removeAttr("aria-controls");
                else {
                    $tierEl.find("a.expanded").removeClass("expanded").removeAttr("aria-expanded"), clearTimeout(theme.hoverRemoveTierTimeoutId);
                    var $targetTierEl = $tierCont.children("." + targetTierClass);
                    $targetTierEl.length == 0 ? ($targetTierEl = $2("<div />").addClass(targetTierClass).attr("id", "menu-" + targetTierClass).appendTo($tierCont), navAnimSpeed > 0 && $targetTierEl.css("height", "0px")) : navAnimSpeed > 0 && $targetTierEl.css("height", $targetTierEl.height() + "px"), $targetTierEl.empty().stop(!0, !1).append($2(this).siblings("ul").clone().attr("style", "")), navAnimSpeed > 0 && $targetTierEl.animate({
                        height: $targetTierEl.children().outerHeight()
                    }, navAnimSpeed, function() {
                        $2(this).css("height", "")
                    }), setTimeout(function() {
                        $targetTierEl.addClass("tier-appeared")
                    }, 10), $2(this).addClass("expanded").attr("aria-expanded", "true").attr("aria-controls", "menu-" + targetTierClass), $2("body").addClass("nav-mega-open")
                }
                return !1
            }), theme.closeOpenMenuItem = function() {
                $2("body").removeClass("nav-mega-open"), $2(".multi-level-nav.reveal-on-hover .has-children.expanded").trigger("forceclose")
            }, $2(document).on("mouseenter mouseleave", ".multi-level-nav.reveal-on-hover .tier-1 .contains-mega-menu", function(e) {
                theme.viewport.isSm() && (clearTimeout(theme.closeOpenMenuItemTimeoutId), e.type == "mouseenter" ? $2(this).children("a").trigger("forceopen") : theme.closeOpenMenuItemTimeoutId = setTimeout(theme.closeOpenMenuItem, 200))
            }), $2(document).on("mouseleave", ".multi-level-nav.reveal-on-hover .tier-appeared", function(e) {
                theme.viewport.isSm() && (clearTimeout(theme.closeOpenMenuItemTimeoutId), theme.closeOpenMenuItemTimeoutId = setTimeout(theme.closeOpenMenuItem, 50))
            }), $2(document).on("mouseenter", ".multi-level-nav.reveal-on-hover .tier-2, .multi-level-nav.reveal-on-hover .tier-3", function(e) {
                theme.viewport.isSm() && clearTimeout(theme.closeOpenMenuItemTimeoutId)
            }), $2(document).on("keydown", ".multi-level-nav .contains-children > a.has-children", function(e) {
                if (e.key == "Enter") return $2(this).parent().hasClass("contains-mega-menu") ? $2(this).attr("aria-expanded") == "true" ? theme.closeOpenMenuItem() : $2(this).trigger("forceopen") : $2(this).parent().toggleClass("reveal-child"), !1
            });
    
            function isPageScrollin() {
                return $2("#page-content").outerHeight() > $2(window).height()
            }
            var removeModalTimeoutID = -1,
                closeModalDelay = 300;
            window.closeThemeModal = function(immediate, callbackFn) {
                $2("a[data-modal-toggle].active").removeClass("active");
                var $modal = $2(".theme-modal.reveal");
                $modal.removeClass("reveal").addClass("unreveal"), $2("html.supports-transforms").length && (typeof immediate > "u" || !immediate) ? removeModalTimeoutID = setTimeout(function() {
                    $2("body").removeClass("modal-active"), $2("body, #page-content, #site-control").css("padding-right", "")
                }, closeModalDelay) : ($2("body").removeClass("modal-active"), $2("body, #site-control").css("padding-right", "")), $modal.find("a").attr("tabindex", "-1"), immediate ? $2("body").removeAttr("data-modal-id") : setTimeout(function() {
                    $2("body").removeAttr("data-modal-id")
                }, 200), $2(window).trigger("ccModalClosing"), setTimeout(function() {
                    $2("body").removeClass("modal-closing"), $modal.attr("id") === "quick-buy-modal" && $modal.remove(), callbackFn && callbackFn(), $2(window).trigger("ccModalClosed")
                }, 300), $2("#search-modal").removeClass("-in")
            }, window.showThemeModal = function(el, id, callbackFn) {
                closeThemeModal(!0), $2(".theme-modal.temp").remove(), theme.Nav().bar.hide(!1);
                var $el = $2(el);
                $el.appendTo("body"), setTimeout(function() {
                    $el.addClass("reveal")
                }, 10), theme.addControlPaddingToModal();
                const scrollbarWidth = $2.scrollBarWidth();
                isPageScrollin() && $2("#page-content, #site-control").css("padding-right", scrollbarWidth), $2("body").addClass("modal-active modal-opening"), id && $2("body").attr("data-modal-id", id), setTimeout(function() {
                    $2(".theme-modal:visible [data-modal-close]").length && $2(".theme-modal:visible [data-modal-close]").focus(), $2("body").removeClass("modal-opening")
                }, 300), scrollbarWidth > 0 && $2(".theme-modal:visible").addClass("scrollbar-visible"), callbackFn && callbackFn($el)
            }, window.showInPageModal = function($target) {
                $target.removeClass("unreveal").addClass("reveal"), theme.addControlPaddingToModal();
                var $inputs = $target.find(".focus-me");
                $2(this).addClass("active"), isPageScrollin() && $2("body, #site-control").css("padding-right", $2.scrollBarWidth()), $2("body").addClass("modal-active modal-opening").attr("data-modal-id", $target.attr("id")), $2("a[tabindex]", $target).removeAttr("tabindex"), $inputs.length == 0 ? $target.closest(".theme-modal").focus() : theme.viewport.isSm() && $inputs.focus(), $target.attr("id") === "search-modal" && setTimeout(function() {
                    $2("#search-modal").addClass("-in")
                }, 400), setTimeout(function() {
                    $2("body").removeClass("modal-opening")
                }, 400)
            }, $2(document).on("click", "body:not(.modal-active) a[data-modal-toggle]", function(e) {
                e.preventDefault(), window.showInPageModal($2($2(this).data("modal-toggle")))
            }), $2(document).on("keyup", function(e) {
                e.which == 27 && closeThemeModal()
            }), $2(document).on("click", "body.modal-active a[data-modal-close]", function() {
                return closeThemeModal(), !1
            }), $2(document).on("click", ".theme-modal", function(e) {
                if (e.target == this) return closeThemeModal(), $2(this).trigger("reset-modal"), !1
            }), $2(document).on("click", "body.modal-active a[data-modal-toggle]", function() {
                return closeThemeModal(!0), $2(this).click(), !1
            }), $2(document).on("click", ".site-control a[data-modal-nav-toggle]", function() {
                return $2("body.modal-active").length ? (closeThemeModal(!0), setTimeout(function() {
                    $2("#page-menu .crumbs a:first").trigger("click")
                }, 305)) : ($2(".nav-ctas__cta .lazyload--manual").removeClass("lazyload--manual").addClass("lazyload"), window.showInPageModal($2("#page-menu"))), !1
            }), $2(document).on("focusin click", "input.select-on-focus", function() {
                $2(this).select()
            }).on("mouseup", "input.select-on-focus", function(e) {
                e.preventDefault()
            }), $2("#template textarea").each(function() {
                $2(this).autogrow({
                    animate: !1,
                    onInitialize: !0
                })
            }), $2(document).on("click", ".quantity-wrapper [data-quantity]", function() {
                var adj = $2(this).data("quantity") == "up" ? 1 : -1,
                    $qty = $2(this).closest(".quantity-wrapper").find("[name=quantity]");
                $qty.val(Math.max(1, parseInt($qty.val()) + adj));
                try {
                    const $form = $2(this).closest('form[action="/cart/add"]');
                    if ($form.length) {
                        const $var_id = $form.find('[name="id"]').val();
                        if ($var_id) {
                            const max_qty = $form.find(`.original-selector option[value="${$var_id}"]`).data("inventory");
                            parseInt($qty.val()) >= max_qty ? $2(this).closest(".quantity-wrapper").find('[data-quantity="up"]').attr("disabled", "") : $2(this).closest(".quantity-wrapper").find('[data-quantity="up"]').removeAttr("disabled")
                        }
                    }
                } catch (err) {
                    console.log(err)
                }
                return !1
            }), $2(document).on("input", '[name="quantity"]', function() {
                try {
                    const $form = $2(this).closest('form[action="/cart/add"]');
                    if ($form.length) {
                        const $var_id = $form.find('[name="id"]').val();
                        if ($var_id) {
                            const max_qty = $form.find(`.original-selector option[value="${$var_id}"]`).data("inventory");
                            parseInt($2(this).val()) >= max_qty ? ($2(this).val(max_qty <= 1 ? 1 : max_qty), $2(this).closest(".quantity-wrapper").find('[data-quantity="up"]').attr("disabled", "")) : $2(this).closest(".quantity-wrapper").find('[data-quantity="up"]').removeAttr("disabled")
                        }
                    }
                } catch (err) {
                    console.log(err)
                }
                return !1
            }), $2(document).on("change", "select.redirecter", function() {
                window.location = $2(this).val()
            }), theme.getUrlParameter = function(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
            };
            const formType = theme.getUrlParameter("form_type");
            (theme.getUrlParameter("customer_posted") || formType && formType === "customer") && window.location.hash && window.location.hash === "footer_newsletter_signup" && setTimeout(() => {
                $2("html,body").animate({
                    scrollTop: $2("#footer_newsletter_signup").offset().top - 100
                }, 1e3)
            }, 100), navigator.userAgent.toLowerCase().indexOf("android") > -1 && $2("html").addClass("os-android"), $2(document).on("click", "[data-cc-checkout-button]", function(e) {
                if ($2("#cc-checkout-form").length) return $2("#cc-checkout-form").submit(), !1;
                console.warn("Unable to find form with id cc-checkout-form")
            }), $2(document).on("click", "[data-cc-animate-click]", function(e) {
                if ((theme.settings.animationEnabledDesktop && theme.viewport.isSm() || theme.settings.animationEnabledMobile && theme.viewport.isXs()) && (window.location.hostname === this.hostname || !this.hostname.length) && $2(this).attr("href").length > 0 && $2(this).attr("href") !== "#") {
                    e.preventDefault();
                    const isAnimationFast = $2("body").hasClass("animation-speed-fast"),
                        pageNavigateDelay = isAnimationFast ? 100 : 200,
                        loaderVisibleDuration = isAnimationFast ? 800 : 1300,
                        $veil = $2("#cc-veil"),
                        isLoadingAnimation = $veil.hasClass("cc-veil--animate"),
                        url = $2(this).attr("href");
                    return $2("body").append(`<link rel="prefetch" href="${url}">`), $veil.addClass("-in"), isLoadingAnimation && setTimeout(() => {
                        $veil.addClass("cc-veil--animate--in").addClass("cc-veil--animate--running")
                    }, pageNavigateDelay + 100), setTimeout(() => {
                        $veil.removeClass("cc-veil--animate--in"), window.location.href = url
                    }, isLoadingAnimation ? loaderVisibleDuration : pageNavigateDelay), setTimeout(() => {
                        $2("#cc-veil").removeClass("-in")
                    }, 8e3), !1
                }
            }), setTimeout(lazySizes.autoSizer.checkElems, 1e3);
    
            function handleFirstTab(e) {
                e.keyCode === 9 && ($2("body").addClass("user-is-tabbing"), window.removeEventListener("keydown", handleFirstTab))
            }
            window.addEventListener("keydown", handleFirstTab), document.querySelector(".shopify-challenge__container") && (document.getElementById("shopify-section-footer").style.display = "none"), theme.device.isTouch() && document.getElementsByTagName("html")[0].classList.add("touch");
            const firstSection = document.body.querySelector(".template-index #page-content .shopify-section:first-child [data-cc-animate]");
            if (firstSection && LocalStorageUtil.get("is_first_visit") === null && firstSection.removeAttribute("data-cc-animate"), LocalStorageUtil.set("is_first_visit", "false"), $2(document).on("shopify:section:reorder", function(e) {
                    setTimeout(theme.init, 500)
                }), $2(document).on("shopify:section:load", function(e) {
                    $2(".rte a img", e.target).closest("a").addClass("contains-img"), $2(".feature-header", e.target).length && $2(window).trigger("assessFeatureHeaders"), theme.inlineVideos.init(e.target), theme.init()
                }), $2(document).on("shopify:section:unload", function(e) {
                    theme.inlineVideos.destroy(e.target), setTimeout(() => {
                        theme.init()
                    }, 0)
                }), $2(window).on("debouncedresizewidth", theme.windowResize), window.matchMedia) {
                const mq = window.matchMedia("(min-width: 768px)");
                mq.addEventListener && mq.addEventListener("change", event => {
                    const customEvent = new CustomEvent("cc-mobile-viewport-size-change");
                    window.dispatchEvent(customEvent)
                })
            }
            $2(document).on("click", "[data-collection-sort-filter]", function(event) {
                $2(this).closest(".as-collection__sortBy").find("[data-collection-sortby-form]").toggleClass("hidden")
            }), $2(document).on("click", "[data-collection-sortby-form] label", function(event) {
                event.preventDefault(), event.stopImmediatePropagation();
                let sortValue = $2(this).find("input").val();
                $2(".cc-accordion .cc-product-filter__sort-by input").each(function(index, sortItem) {
                    $2(sortItem).val() === sortValue && $2(sortItem).closest("label").trigger("click")
                })
            }), $2(document).on("click", function(event) {
                $2(event.target).closest("[data-collection-sort-filter], [data-collection-sortby-form]").length || $2("[data-collection-sortby-form]").addClass("hidden")
            }), $2(document).on("click", "[data-product-image-id] img", function() {
                let imageID = $2(this).closest("[data-product-image-id]").attr("data-product-image-id");
                $2(this).closest("[data-product-image-id]").siblings().removeClass("as-collection__activeItem"), $2(this).closest("[data-product-image-id]").addClass("as-collection__activeItem"), $2(this).closest(".as-collection__itemWrap--color").next().find("[data-product-size-id]").each(function(index, size) {
                    let sizeID = $2(size).attr("data-product-size-id");
                    $2(size).addClass("hidden"), imageID == sizeID && $2(size).removeClass("hidden")
                });
                let imageSRC = $2(this).parent().data("product-image-url"),
                    imageALT = $2(this).attr("alt");
                $2(this).closest("[data-product-main-block]").find("[data-product-image] .rimage-wrapper").empty();
                let newImg = $2("<img>");
                newImg.addClass("rimage__image fade-in lazyautosizes lazyloaded"), newImg.attr("src", imageSRC), newImg.attr("alt", imageALT), $2(this).closest("[data-product-main-block]").find("[data-product-image] .rimage-wrapper").append(newImg);
                let slides = $2(this).closest("[data-product-main-block]").find("[data-product-image] .product-block--slide");
                slides.length > 0 && slides.remove();
                let productURL = $2(this).parent().data("product-url");
                $2(this).closest("[data-product-main-block]").find("[data-product-image], .caption").attr("href", productURL)
            });
            let matchingTags = $2("[data-collection-tags]").attr("data-collection-tags");
            matchingTags ? $2('input[name="filter.p.tag"]').each(function(index, value) {
                let inputValue = $2(value).val(),
                    parentElement = $2(value).parent(),
                    tagsArray = matchingTags.split(","),
                    tagMatches = !1;
                tagsArray.forEach(tag => {
                    if (tag.trim() === inputValue.trim()) return tagMatches = !0, !1
                }), tagMatches ? (parentElement.removeClass("hidden"), parentElement.css("display", "block")) : (parentElement.addClass("hidden"), parentElement.css("display", "none"))
            }) : $2('input[name="filter.p.tag"]').each(function(index, value) {
                let parentElement = $2(value).closest(".cc-accordion.cc-initialized");
                parentElement.addClass("hidden"), parentElement.css("display", "none")
            }), $2(document).on("click", "[data-filter-close]", function() {
                const nav2 = theme.Nav();
                $2(".cc-product-filter").hasClass("-in") && (nav2.bar.fadeOut(!1), $2(".cc-product-filter").removeClass("-in"), $2("[data-footer-reset-button]").css("display", "none"), $2("body").css("overflow", "auto"))
            }), $2(document).on("mouseenter", "[data-product-main-block]", function() {
                $2(this).find(".as-collection__imageSwatchWrap").length > 0 || ($2(this).find(".caption, .as-productColors, .as-collection__badgeWrap").css({
                    opacity: 1,
                    visibility: "visible"
                }), $2(this).find(".as-collection__imageSwatchWrap").css({
                    opacity: 0,
                    visibility: "hidden"
                }))
            });
            let totalCount = 0;
            $2(document).on("change", ".as-salomon__cartPage [data-cart-main-checkbox]", function() {
                let isChecked = $2(this).is(":checked");
                $2(".as-salomon__cartPage [data-cart-checkbox]").prop("checked", isChecked).trigger("change"), totalCount = isChecked ? calculateTotalCount() : 0, $2(".as-salomon__cartPage [data-cart-count]").text(totalCount)
            }), $2(document).on("change", ".as-salomon__cartPage [data-cart-checkbox]", function() {
                if ($2(this).is(":checked")) {
                    let quantity = parseInt($2(this).closest(".cart-item").find(".cart-item__quantity-input").val());
                    totalCount += quantity
                } else {
                    let quantity = parseInt($2(this).closest(".cart-item").find(".cart-item__quantity-input").val());
                    totalCount -= quantity
                }
                $2(".as-salomon__cartPage [data-cart-count]").text(totalCount);
                let allChecked = !0;
                $2(".as-salomon__cartPage [data-cart-checkbox]").each(function() {
                    if (!$2(this).prop("checked")) return allChecked = !1, !1
                }), $2(".as-salomon__cartPage [data-cart-main-checkbox]").prop("checked", allChecked)
            });
    
            function calculateTotalCount() {
                let total = 0;
                return $2(".as-salomon__cartPage [data-cart-checkbox]").each(function() {
                    if ($2(this).is(":checked")) {
                        let quantity = parseInt($2(this).closest(".cart-item").find(".cart-item__quantity-input").val());
                        total += quantity
                    }
                }), total
            }
            $2(document).on("click", ".as-salomon__cartPage [data-bulk-delete-button]", function() {
                let formData = {
                    updates: {}
                };
                if ($2(".as-salomon__cartPage [data-cart-checkbox]:checked").length === 0) {
                    alert("\uC0C1\uD488\uC744 \uC120\uD0DD\uD558\uC2E0 \uD6C4 \uC0AD\uC81C\uD574\uC8FC\uC138\uC694.");
                    return
                }
                $2(".as-salomon__cartPage [data-cart-checkbox]:checked").each(function() {
                    let productId = $2(this).attr("data-item-variant-id");
                    formData.updates[productId] = 0
                }), $2.ajax({
                    type: "POST",
                    url: "/cart/update.js",
                    data: formData,
                    success: function(data) {
                        console.log("Products deleted successfully"), setTimeout(function() {
                            location.reload()
                        }, 1e3)
                    },
                    error: function(xhr, status2, error) {
                        console.error("Error deleting products:", error)
                    }
                })
            }), $2(".as-salomon__cartPage [data-item-property]").each(function(index, item) {
                const propertyString = $2(item).attr("data-item-property"),
                    obj = JSON.parse(propertyString);
                if (obj.config_image_urls.length > 0) {
                    const propertyImage = obj.config_image_urls[0];
                    $2(item).find(".col-image img").attr("src", propertyImage), $2(item).find(".col-image img").attr("srcset", propertyImage)
                }
            }), $2(function() {
                theme.init(), $2(window).trigger("slideshowfillheight"), $2(window).trigger("assessFeatureHeaders")
            });
            const deferredLoadViewportExcess = 1200;
            theme.Sections.init(), theme.Sections.register("header", theme.HeaderSection, {
                deferredLoad: !1
            }), theme.Sections.register("footer", theme.FooterSection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("slideshow", theme.SlideshowSection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("video", theme.VideoManager, {
                deferredLoadViewportExcess
            }), theme.Sections.register("background-video", theme.VideoManager, {
                deferredLoadViewportExcess
            }), theme.Sections.register("image-with-text-overlay", theme.ImageWithTextOverlay, {
                deferredLoadViewportExcess
            }), theme.Sections.register("image-beside-image", theme.ImageBesideImageSection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("featured-collection", theme.FeaturedCollectionSection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("collection-list", theme.CollectionListSection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("featured-blog", theme.FeaturedBlogSection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("product-template", theme.ProductTemplateSection, {
                deferredLoadViewportExcess: 200
            }), theme.Sections.register("product-template-calendar", theme.ProductTemplateCalendarSection, {
                deferredLoadViewportExcess: 200
            }), theme.Sections.register("collection-template", theme.FilterManager, {
                deferredLoad: !1
            }), theme.Sections.register("blog-template", theme.BlogTemplateSection, {
                deferredLoad: !1
            }), theme.Sections.register("article-template", theme.ArticleTemplateSection, {
                deferredLoad: !1
            }), theme.Sections.register("list-collections", theme.ListCollectionsSection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("cart-template", theme.CartTemplateSection, {
                deferredLoad: !1
            }), theme.Sections.register("cart-template-popup", theme.CartTemplateSection, {
                deferredLoad: !1
            }), theme.Sections.register("product-recommendations", theme.ProductRecommendations, {
                deferredLoadViewportExcess
            }), theme.Sections.register("gallery", theme.GallerySection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("testimonials", theme.TestimonialsSection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("accordion", theme.AccordionSection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("faq", theme.FaqSection, {
                deferredLoadViewportExcess
            }), theme.Sections.register("search-template", theme.FilterManager, {
                deferredLoad: !1
            }), theme.Sections.register("scrolling-banner", theme.ScrollingBannerSection, {
                deferredLoadViewportExcess
            })
        }), $(function($2) {
            cc.sections.length ? cc.sections.forEach(section => {
                try {
                    let data = {};
                    typeof section.deferredLoad < "u" && (data.deferredLoad = section.deferredLoad), typeof section.deferredLoadViewportExcess < "u" && (data.deferredLoadViewportExcess = section.deferredLoadViewportExcess), theme.Sections.register(section.name, section.section, data)
                } catch (err) {
                    console.error(`Unable to register section ${section.name}.`, err)
                }
            }) : console.warn("Barry: No common sections have been registered.")
        })
    })(theme.jQuery);
    //# sourceMappingURL=/cdn/shop/t/167/assets/theme.js.map?v=66815401100991641821733278616