define(['marionette', 'bootstrap'], function(){
	app = new Backbone.Marionette.Application();
	app.addRegions({
		songSidebar: '#song-sidebar',
		arrangementSidebar: '#arrangement-sidebar'
	});

	app.addInitializer(function(){
		app.vent.on({
			'tab:show':function(model){
				if (model instanceof app.Song.Model){
					app.songTabManager.addTab({
						title: model.get('name'),
						model: model
					}).showTab({
						id:model.get('id')
					});
					$('#app-song-tab').tab('show');
				}else if (model instanceof app.Arrangement.Model){
					app.arrangementTabManager.addTab({
						title: model.get('description'),
						model: model
					}).showTab({
						id:model.get('id')
					});
					$('#app-arrangement-tab').tab('show');
				}
			},
			'fetch':function(model){
				model.fetch({
					success:function(model, response, options){

					},
					error: function(model, response, options){
						app.vent.trigger('fetch:error',response.status);
					}
				});
			},
			'save':function(model){
				model.save(null,{
					success: function(model, response, options){

					},
					error: function(model, response, options){
						app.vent.trigger('save:error',response.status);
					}
				});
			},
			'destroy':function(model){
				model.destroy({
					success:function(model, response, options){

					},
					error:function(model, response, options){
						app.vent.trigger('destroy:error',response.status);
					}
				});
			},
			'fetch:error':function(status){
				if(status == 401){
					alert('you need to login');
				}else{
					alert('fetch error: ' + statusCode);
				}

			},
			'save:error':function(status){
				if(status == 401){
					alert('you need to login');
				}else{
					alert('save error: ' + statusCode);
				}
			},
			'destroy:error':function(status){
				if(status == 401){
					alert('you need to login');
				}else{
					alert('destroy error: ' + statusCode);
				}
			}
		});

	});

	app.start();

	return app;

});
