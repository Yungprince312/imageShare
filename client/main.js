import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Session} from 'meteor/session'

import './main.html';
import '../lib/collection.js';


Session.set('imglimit', 2);

Template.myJumbo.events({
	'click .js-addImg'(event){
		$("#addImgModal").modal("show");
	}
});

Template.addImg.events({
	'click .js-saveImg'(event){
		var imgTitle = $("#imgTitle").val();
		var imgPath = $("#imgPath").val();
		var imgDesc = $("#imgDesc").val();
		
		$("#imgTitle").val('');
		$("#imgPath").val('');
		$("#imgDesc").val('');
		$("#addImgPreview").attr('src','user-512.png');
		$("#addImgModal").modal("hide");
		ImagesDB.insert({"title":imgTitle, "path":imgPath, "desc":imgDesc, "createdOn":new Date().getTime()});
	},
	'click .js-cancelAdd'(){
		$("#imgTitle").val('');
		$("#imgPath").val('');
		$("#imgDesc").val('');
		$("#addImgPreview").attr('src','user-512.png');
		$("#addImgModal").modal("hide");
	},
	'input #imgPath'(event){
		var imgPath = $("#imgPath").val();
		$("#addImgPreview").attr('src', imgPath);
	}
});

Template.mainBody.helpers({
	imagesFound(){
		return ImagesDB.find().count();
	},
	imageAge(){
		var imgCreatedOn = ImagesDB.findOne({_id:this._id}).createdOn;
		imgCreatedOn = Math.round((new Date() - imgCreatedOn)/60000);
		var timeUnit = " mins";
			if(imgCreatedOn > 60){
				imgCreatedOn= Math.round(imgCreatedOn/60);
				timeUnit = " hours";
			} 
			else if(imgCreatedOn > 1440){
				imgCreatedOn=Math.round(imgCreatedOn/1440);
				timeUnit = " days";
			} 
		return imgCreatedOn + timeUnit;
	},
	allImages(){
		//gives current time - 15 secs
		var prevTime = new Date() - 15000;
		var newResults = ImagesDB.find({createdOn: {$gte:prevTime}}).count();
		if (newResults > 0) {
			//console.log(newResults, "new image");
			return ImagesDB.find({}, {sort:{createdOn: -1, imgRate: -1}, limit:Session.get('imglimit')});
		} else{
			return ImagesDB.find({}, {sort:{imgRate: -1, createdOn: 1}, limit:Session.get('imglimit')});
		}
	}
});

Template.mainBody.events({
	'click .js-deleteImg'(){
		var imgId = this._id;
		$("#"+imgId).fadeOut('slow', function(){
			ImagesDB.remove({_id:imgId});
		});
	},
	'click .js-editImage'(){
		var imgId = this._id;
		$('#ImgPreview').attr('src',ImagesDB.findOne({_id:imgId}).path);
		$("#eimgTitle").val(ImagesDB.findOne({_id:imgId}).title);
		$("#eimgPath").val(ImagesDB.findOne({_id:imgId}).path);
		$("#eimgDesc").val(ImagesDB.findOne({_id:imgId}).desc);
		$('#eId').val(ImagesDB.findOne({_id:imgId})._id);
		$('#editImgModal').modal("show");
	},
	'click .js-rate'(event){
		var imgId = this.data_id;
		var rating = $(event.currentTarget).data('userrating');
		ImagesDB.update({_id:imgId}, {$set:{'imgRate':rating}})
		//console.log("you clicked a star",imgId "with a rating of", rating);
		
	}
});

Template.editImg.events({
	'click .js-updateImg'(){
		var eId = $('#eId').val();
		var imgTitle = $("#eimgTitle").val();
		var imgPath = $("#eimgPath").val();
		var imgDesc = $("#eimgDesc").val();
		ImagesDB.update({_id:eId}, {$set:{"title":imgTitle, "path":imgPath, "desc":imgDesc}});
		$('#editImgModal').modal("hide");
	}
});

lastScrollTop = 0;
$(window).scroll(function(event){
	// test if we are near the bottom of the window
	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		// where are we in the page?
		var scrollTop = $(this).scrollTop();
		//test if we are going down
		if (scrollTop > lastScrollTop) {
			// yes we are heading down
			Session.set('imglimit', Session.get('imglimit') + 3);
		}
		lastScrollTop = scrollTop;
	}
});