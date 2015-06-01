var nodeId = 0;

$(document).ready(function(){
  $('iframe').hide()
   $.ajax({
    url: "generate_treeview.php",
    type: "POST",
    success: function(data)
    {
      $('.tree').html(data);

      $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Expand this branch');
      $('.tree li.parent_li').find(' > ul > li').hide();
      $('#categories').find(' > ul > li').show();

    },
    error:function(data){alert(data);
    }
  });    

   $.ajax({
    url: "getvideos.php",
    type: "POST",
    data: {nodeId: nodeId},
    success: function(data)
    {
      //$('#info').empty();
      var videos = jQuery.parseJSON(data);    // Take all videos from JSON.

      $.each(videos.videos.video, function(i, v){
        $('#info').append('<a class="video" href="'+ v.videoId +'" title="'+ v.title +'" data-witdh = "640" data-height = "360"  href="'+ v.location +'"><img src="http://img.youtube.com/vi/'+ v.videoId +'/1.jpg"></a>'); 
      });

      var pages = Math.ceil(videos[0].size/ResultsperPage);
      $('#paginationdiv p').empty().append('Page 1 of ' + pages);
      $('#Prev_page, #Next_page, #Last_page, #First_page').removeClass('disabled');
      $('#Next_page a').attr('href', '2');
      $('#Last_page a').attr('href', pages);
    },
    error:function(data){alert(data);
    }
  });

});

// change node condition and icon

$('body').on('click', '.tree li.parent_li > span', function (e) {
  var children = $(this).parent('li.parent_li').find(' > ul > li');
  if (children.is(":visible")) {
      children.hide('fast');
      $(this).attr('title', 'Expand this branch').find(' > i').addClass("glyphicon-plus-sign").removeClass("glyphicon-minus-sign");
  } else {
      children.show('fast');
      $(this).attr('title', 'Collapse this branch').find(' > i').addClass("glyphicon-minus-sign").removeClass("glyphicon-plus-sign");
  }
  e.stopPropagation();
});

var ResultsperPage = 42;

// When user clicks on a node

$('body').on('click', '.tree li span', function(){

  $('iframe').hide()
  nodeId = $(this).attr('id');
  var page = 1;
  $.ajax({
    url:"getvideos.php",
    type:"POST",   
    data:{nodeId : nodeId},
    success:function(data) {
      $('#info a').empty();
      $('#frame').hide().attr('src', "");
      var videos = jQuery.parseJSON(data);    // Take all videos from JSON.

      $.each(videos.videos.video, function(i, v){
        $('#info').append('<a class="video" href="'+ v.videoId +'" title="'+ v.title +'" data-witdh = "640" data-height = "360"  href="'+ v.location +'"><img src="http://img.youtube.com/vi/'+ v.videoId +'/1.jpg"></a>'); 
      });

      var pages = Math.ceil(videos[0].size/ResultsperPage);
      CheckPage(page, pages);
      $('#paginationdiv').show();
    },
    error:function(data){
    }
  });
  return false;
});

$('body').on('click', '.nextpage',function(e){
  var thispage = $(this).attr('href');

  $.ajax({
  url:"getvideos.php",
  type:"POST",   
  data:{nodeId : nodeId, page : thispage},
  success:function(data) {
    $('#info a').empty();
    var videos = jQuery.parseJSON(data);    // Take all videos from JSON.

    $.each(videos.videos.video, function(i, v){
      $('#info').append('<a class="video" title="'+ v.title +'" data-witdh = "640" data-height = "360"  href="'+ v.location +'"><img src="http://img.youtube.com/vi/'+ v.videoId +'/1.jpg"></a>'); 
    });

    var pages = Math.ceil(videos[0].size/ResultsperPage);
    CheckPage(thispage, pages);
  }
  });

  return false;
 });

$('body').on('click', '#showall',function(e){
  $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
  $('.tree li.parent_li').find(' > ul > li').show('fast')
  $('.tree li.parent_li i').addClass("glyphicon-minus-sign").removeClass("glyphicon-plus-sign");
  $('.tree li.movie i').addClass("glyphicon-film").removeClass("glyphicon-minus-sign");
  });

$('body').on('click', '#hideall', function(e){
  $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Expand this branch');
  $('.tree li.parent_li').find(' > ul > li').hide('fast');
  $('#categories').find(' > ul > li').show('fast');
  $('.tree li.parent_li i').addClass("glyphicon-plus-sign").removeClass("glyphicon-minus-sign");  
  $('.tree li.movie i').addClass("glyphicon-film").removeClass("glyphicon-plus-sign");   
});


function CheckPage(thispage, numberofpages)
{
  var nextpage = parseInt(thispage) + 1;
  var prevpage = parseInt(thispage) - 1;

  if(thispage == 1)
  {
    $('#paginationdiv p').empty().append('Page ' + thispage + ' of ' + numberofpages);
    $('#Next_page, #First_page, #Last_page').removeClass('disabled');
    $('#Pre_page').addClass('disabled', 'disabled');
    $('#Pre_page a').attr('href', '#');
    $('#Next_page a').attr('href', nextpage); 
    $('#Last_page a').attr('href', numberofpages);
  }
  if(thispage > 1 && thispage < numberofpages)
  {
    $('#paginationdiv p').empty().append('Page ' + thispage + ' of ' + numberofpages);
    $('#Pre_page').removeClass('disabled');
    $('#Pre_page a').attr('href', prevpage);      
    $('#Next_page').removeClass('disabled'); 
    $('#Next_page a').attr('href', nextpage);
  }
  if(thispage == numberofpages)
  {
    $('#paginationdiv p').empty().append('Page ' + thispage + ' of ' + numberofpages);
    $('#Pre_page').removeClass('disabled');
    $('#Pre_page a').attr('href', prevpage);      
    $('#Next_page').addClass('disabled', 'disabled');
    $('#Next_page a').attr('href', '#');
  }

}