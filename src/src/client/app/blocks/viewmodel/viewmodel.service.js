(function() {
  'use strict';

  angular
    .module('blocks.viewModel')
    .service('viewModel', ViewModelService);

  ViewModelService.$inject = ['models'];

  function ViewModelService(models) {
    this.models = models;
  }
  
  ViewModelService.prototype = {

    initialize: function(modelObj) {
        var that = this;
        this.model = modelObj.model;
        this.fieldlist = this.models.Contact.prototype.fieldlist('read');
        this.fieldlistForSyncUp = _.without(this.models.Contact.prototype.fieldlist('read'), "Id", "LastModifiedDate");


        // var setupProps = function(props) {
        //     props.forEach(function(prop) {
        //         Object.defineProperty(that, prop, {
        //             get: function() {
        //                 return that.model.get(prop);
        //             },
        //             set: function(val) {
        //                 that.model.set(prop, val);
        //             },
        //             enumerable: true
        //         });
        //     });
        // }
        // setupProps(_.union(_.keys(that.model.attributes), that.model.fieldlist));
        // // Setup an event listener to update properties whenever model attributes change
        // this.model.on('change', function() {
        //     setupProps(_.difference(_.keys(that.model.attributes), _.keys(that)));
        // });

        
        document.addEventListener("sync", function() { 
            that.handleSyncUpdate(event.detail);
        });
    },

    
    // syncUp followed by syncDown followed by search
    handleSyncUpdate: function(sync) {
        if (sync.status !== "DONE") {
            // $(".sync").html("Sync - " + sync.type + " " + Math.round(sync.progress) + "%");

            if (sync.type === "syncDown") {
                this.lastSyncDownId = sync._soupEntryId;
            }
        }
        else {
            // $(".sync").html("Sync");

            if (sync.type === "syncDown") {
                this.syncInFlight = false;
                // $(".sync").disabled = false;
                this.search();
            }
            if (sync.type === "syncUp") {
                this.syncDown();
            }
        }
    },

    syncDown: function() {
        if (!_.isNumber(this.lastSyncDownId)) {
            // First time
            var target = {type:"soql", query:"SELECT " + this.fieldlist.join(",") + " FROM Contact  LIMIT 10000"};
            cordova.require("com.salesforce.plugin.smartsync").syncDown(target, "contacts", {mergeMode:Force.MERGE_MODE_DOWNLOAD.OVERWRITE}, this.handleSyncUpdate.bind(this));
        }
        else {
            // Subsequent times
            cordova.require("com.salesforce.plugin.smartsync").reSync(this.lastSyncDownId, this.handleSyncUpdate.bind(this));
        }
    },

    syncUp: function() {
        cordova.require("com.salesforce.plugin.smartsync").syncUp("contacts", {fieldlist: this.fieldlistForSyncUp}, this.handleSyncUpdate.bind(this));
    },

    sync: function() {
        if (!this.syncInFlight) {
            this.syncInFlight = true;
            // $(".sync").disabled = true;
            this.syncUp();
        }
    },
    search: function(event) {
        this.model.setCriteria('');
        this.model.fetch();
    }
  }


})();
