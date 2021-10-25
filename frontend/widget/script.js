define(
  [ 'jquery', 'underscore', 'twigjs', 'lib/components/base/modal' ],

  function ( $, _, Twig, Modal )
  {
    let CustomWidget = function () {
      let self         = this;

      this.config      = {
        isDev        : true,
        baseUrl      : 'https://',
        name         : 'goToChat',
        widgetPrefix : 'gotochat',
      },

      this.dataStorage = {
        currentModal : null,
      },

      this.selectors   = {
        classPhoneNum : 'js-control-phone.control-phone',
        whatsapp      : `${self.config.widgetPrefix}_wa`,
        viber         : `${self.config.widgetPrefix}_viber`,

        js : {
          phoneNum : 'div[data-type="phone"]'
        },
      },

      this.getters     = {},

      this.setters     = {},

      this.baseHtml    = {},

      this.renderers   = {

        /**
         * Method for generating and rendering the .twig template
         * 
         * @public
         * 
         * @param {str} template - the name of the .twig template
         * @param {obj} params - template settings. The format is:
         * {
         *    widgetPrefix : self.config.widgetPrefix,
         *    ...
         * }
         * 
         * @param {obj} callback - callback settings. The format is:
         * {
         *    exec : function ( param_1.val, param_2.val, ..., param_n.val ) {},
         *    params : {
         *      param_1 : val,
         *      param_2 : val,
         *      ...
         *      param_n : val,
         *    }
         * }
         * 
         * @returns
         */
        render           : function ( template, params, callback ) {
          self.helpers.debug( self.config.name + " << [renderer] : render for " + template );

          params = ( typeof params == 'object' ) ? params : {};
          template = template || '';

          return self.render(
            {
              href: '/templates/' + template + '.twig',
              base_path: self.params.path,
              v: self.get_version(),
              load: ( template ) => {
                let html = template.render( { data: params } );

                callback.params ? callback.exec( html, callback.params ) : callback.exec( html );
              }
            },

            params
          );
        },

        /**
         * This method renders the user interface for choosing a messenger
         * 
         * @param {str} selector 
         * @param {obj} data 
         * @param {str} location 
         * 
         * @returns {void}
         */
        renderMessengers : function ( selector = null, data = null, location = 'append' ) {
          self.helpers.debug( self.config.name + " << [renderer] : renderMessengers" );

          let messengersData = {
            widgetPrefix : self.config.widgetPrefix
          };

          self.renderers.render(
            'messengers',
            messengersData,
            {
              exec : function ( html ) {
                let listPhone = $( `.${self.selectors.classPhoneNum}` ).parent();

                for( let i = 0; i < listPhone.length; i++ )
                {
                  $( listPhone[ i ].querySelector( self.selectors.js.phoneNum ) ).after( html );
                }

                $( `.${self.selectors.whatsapp}` ).on( 'click', self.handlers.onWaClick );
                $( `.${self.selectors.viber}` ).on( 'click', self.handlers.onViberClick );
              }
            }
          );
        },

        modalWindow      : {
          show: function ( html, modalParams, callback = false, callbackParams = {} ) {
            self.dataStorage.flags.modalEvent = true;

            self.dataStorage.currentModal = new Modal (
              {
                class_name: "modal-window",

                init: function( $modal_body ) {
                  self.currentModal = $( this );

                  console.debug( '$modal_body:' );
                  console.debug( self.currentModal );

                  modalParams.sizeParams.width ? $modal_body.css( 'width', modalParams.sizeParams.width ) : $modal_body.css( 'width', 'auto' );
                  modalParams.sizeParams.height ? $modal_body.css( 'height', modalParams.sizeParams.height ) : $modal_body.css( 'height', 'auto' );

                  $modal_body.css( 'margin-top', '-590px' );
                  $modal_body.css( 'margin-left', '-470px' );

                  $modal_body
                    .append( html )
                    .trigger( 'modal:loaded' );

                  if ( callback )
                  {
                    callback();
                  }
                },

                destroy: function () {
                  console.debug( "close modal-destroy" ); // Debug

                  self.dataStorage.flags.modalEvent = false;

                  return true;
                }
              }
            );
          },

          setData: function ( data ) {
            $( 'div.modal-body__inner__todo-types' ).append( data );
          },

          destroy: function () {
            self.dataStorage.currentModal.destroy();
          }
        },
      },

      this.handlers    = {
        /**
         * This method parses the phone and redirects it to the What`s App chat
         * 
         * @param {void}
         * @return {void}
         */
        onWaClick    : function () {
          self.helpers.debug( self.config.name + " << [handler] : onWaClick" );

          let phone = $( this ).parent()
                                .parent()
                                .parent()[ 0 ]
                                .querySelector( 'input.control-phone__formatted' )
                                .value;

          phone = self.helpers.parsePhone( phone );
          self.helpers.openChat( 'whatsapp', phone );
        },

        /**
         * This method parses the phone and redirects it to the Viber chat
         * 
         * @param {void}
         * @return {void}
         */
        onViberClick : function () {
          self.helpers.debug( self.config.name + " << [handler] : onWaClick" );

          let phone = $( this ).parent()
                                .parent()
                                .parent()[ 0 ]
                                .querySelector( 'input.control-phone__formatted' )
                                .value;

          phone = self.helpers.parsePhone( phone );
          self.helpers.openChat( 'viber', phone );
        }
      },

      this.actions     = {},

      this.helpers     = {
        debug      : function ( text ) {
          if ( self.config.isDev ) console.debug( text );
        },

        /**
         * This method parses the selected phone according to a predefined template
         * 
         * @param {string} phone 
         * @returns {string}
         */
        parsePhone : function ( phone ) {
          self.helpers.debug( self.config.name + " << [helper] : parsePhone" );

          let regexpStr = /[A-Za-zА-Яа-яЁё.,\-+_\s+()]/g;

          phone = phone.replace( regexpStr, "" );

          return phone;
        },

        /**
         * This method redirects the user to the selected messenger
         * 
         * @param {string} phone
         * @returns {void}
         */
        openChat   : function ( messenger, phone ) {
          self.helpers.debug( self.config.name + " << [helper] : openChat" );

          switch ( messenger ) {
            case 'whatsapp':
              window.open( 'https://wa.me/' + phone, '_blank' );
            break;

            case 'viber':
              window.open( 'https://viber.click/' + phone, '_blank' );
            break;

            default:
              // TODO ein Modalfenster muss emplementiert werden
            break;
          }
        }
      },

      this.callbacks   = {
        render                 : function () {
          self.helpers.debug( self.config.name + " << render" );
          self.settings = self.get_settings();

          let currentArea = self.system().area;

          if ( currentArea === "lcard" || currentArea === "ccard" )
          {
            self.renderers.renderMessengers();
          }

          return true;
        },

        init                   : function () {
          self.helpers.debug( self.config.name + " << init" );

          if ( !$( 'link[href="' + self.settings.path + '/style.css?v=' + self.settings.version +'"]' ).length )
          {
            $( "head" ).append( '<link type="text/css" rel="stylesheet" href="' + self.settings.path + '/style.css?v=' + self.settings.version + '">' );
          }

          return true;
        },

        bind_actions           : function () {
          self.helpers.debug( self.config.name + " << bind_actions" );

          if ( !document[ self.config.name ] )
          {
            self.helpers.debug( `${self.config.name} does not exist` );

            document[ self.config.name ] = true;
          }
          else
          {
            self.helpers.debug( `${self.config.name} exists` );
          }

          return true;
        },

        settings               : function () {
          self.helpers.debug( self.config.name + " << settings" );

          return true;
        },

        onSave                 : function () {
          self.helpers.debug( self.config.name + " << onSave" );

          return true;
        },

        destroy                : function () {
          self.helpers.debug( self.config.name + " << destroy" );
        },

        contacts               : {
          //select contacts in list and clicked on widget name
          selected: function () {
            self.helpers.debug( self.config.name + " << contacts selected" );
          }
        },

        leads                  : {
          //select leads in list and clicked on widget name
          selected: function () {
            self.helpers.debug( self.config.name + " << leads selected" );
          }
        },

        tasks                  : {
          //select taks in list and clicked on widget name
          selected: function () {
            self.helpers.debug( self.config.name + " << tasks selected" );
          }
        },

        advancedSettings       : function () {
          self.helpers.debug( self.config.name + " << advancedSettings" );

          return true;
        },

        /**
         * Метод срабатывает, когда пользователь в конструкторе Salesbot размещает один из хендлеров виджета.
         * Мы должны вернуть JSON код salesbot'а
         *
         * @param handler_code - Код хендлера, который мы предоставляем. Описан в manifest.json, в примере равен handler_code
         * @param params - Передаются настройки виджета. Формат такой:
         * {
         *   button_title: "TEST",
         *   button_caption: "TEST",
         *   text: "{{lead.cf.10929}}",
         *   number: "{{lead.price}}",
         *   url: "{{contact.cf.10368}}"
         * }
         *
         * @return {{}}
         */
        onSalesbotDesignerSave : function ( handler_code, params ) {
          var salesbot_source = {
              question: [],
              require: []
            },
            button_caption = params.button_caption || "",
            button_title = params.button_title || "",
            text = params.text || "",
            number = params.number || 0,
            handler_template = {
              handler: "show",
              params: {
                type: "buttons",
                value: text + ' ' + number,
                buttons: [
                  button_title + ' ' + button_caption,
                ]
              }
            };

          console.debug(params);

          salesbot_source.question.push(handler_template);

          return JSON.stringify([salesbot_source]);
        },
      };

      return this;
    };

    return CustomWidget;
  }
);