/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
		this.db = { allCards: null, allSets: null };
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		$("#srchBtnA").click(function() {
			app.searchCards();
		});
		$('#splashCover').css("height","100%").css("width","100%")
			.css("min-height","100%").css("min-width","100%")
			.css("z-index","1000").css("display","block");
		$('#splashCover').html("<br/><br/><br/><br/><h1 style'color:white'><strong>READY</strong></h3>" + 
		"<br/><br/><br/><br/><strong>Loading All Cards</strong>");
		
		// load the big ass JSON data sets
		// use AJAX - cordova thinks this is a website
		// puny cordova
		var path="db/";
		$.ajax({ url: path + "AllCards-x.json" })
                .done(function(json) {
						$('#splashCover').html("<br/><br/><br/><br/><h2 style'color:white'><strong>SET</strong></h3>" + 
		"<br/><br/><br/><br/><strong>Loading All Sets</strong>");
						app.db.allCards = $.parseJSON(json);
						$.ajax({ url: path + "AllSets-x.json" })
								.done(function(json) {
										$('#splashCover').html("<br/><br/><br/><br/><h3 style'color:white'><strong>GO</strong></h3>" + 
		"<br/><br/><br/><br/><strong>Parsing data</strong>");
										app.db.allSets = $.parseJSON(json);
											setTimeout(function() { 
												$('#splashCover').css("display","none");
												$('#splashCover').html("");
											}, 2000);
									});
						});
		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },	
	findObjects: function(obj, key, val) {
		// ex: app.findObjects(app.db.allCards,"name","Air Elemental")
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(app.findObjects(obj[i], key, val));
			} else if (i == key && obj[key] == val) {
				objects.push(obj);
			}
		}
		return objects;
	},
	searchCards: function() {
		$("#tempResultDisplay").html("");
		
		var srch4thisName = $('#txtSrchName').val();
		var objects = [];
		for(var card in app.db.allCards) {
			if (card==srch4thisName) objects.push(app.db.allCards[card]);
		}
		var count = objects.length;
		if (count===0) return;
		var T = $("<table></table>")
				.css("width","100%").css("padding", "3px").css("border-spacing","0")
				.css("border-collapse","collapse");
		for (idx=0; idx<count;idx++) {
			var foundCard = objects[idx];
			Object.getOwnPropertyNames(foundCard).forEach(function(val, idx, array) {
				var R = $('<tr style="border-bottom:1px solid blue"></tr>');
			   	$("<td>" + val + "</td>").appendTo(R);
				if (typeof(foundCard[val])!="object") {
					// simple value
					$("<td>" + foundCard[val]+"</td>").appendTo(R);
				} else {
					// object value
					var tmp = "<td>";
					Object.getOwnPropertyNames(foundCard[val])
						.forEach(function(vl, id, ary) {
							if (typeof(foundCard[val][vl])=="object" && val=="legalities") {
								Object.getOwnPropertyNames(foundCard[val][vl])
									.forEach(function(v, i, ar) {
										tmp+="<br>" + v + " : " + foundCard[val][vl][v];
									});
							} else {
								if (vl!="length") {
									if (parseInt(vl)>=0 || parseInt(vl)<=100) {
										tmp+="<br>" + foundCard[val][vl];
									} else {
										tmp+="<br>" + vl + "&nbsp;" + foundCard[val][vl];
									}
								}
							}
						});
					tmp+="</td>";
					$(tmp).appendTo(R);
				}
				$(R).appendTo(T);
			 });
			 
		}
		
		$(T).appendTo("#tempResultDisplay");
		$(T).trigger('create');
	}
}

app.initialize();