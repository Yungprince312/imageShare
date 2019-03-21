import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/collection.js';

Template.myJumbo.events({
	'click .js-adding'(event){
		$("#addimgmodal").modal("show");
	}

});

Template.Adding.events({
	'click .js-saveImg'(event){
		var imgPath = $("#imgPath").val();
		var TitlePath = $("#TitlePath").val();
		var DescPath = $("#DescPath").val();
		console.log("save", imgPath, TitlePath, DescPath);
		$("#addimgmodal").modal("hide");
		ImagesDB.insert({'firstname':fName,
  		'lastname':lName, 'img':Photopic});
	}
});