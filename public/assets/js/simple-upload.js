$('#ajax-form').on('submit', function(evt) {

    var fd = new FormData(this);
    $('h1').text('Uploading...');
    $.ajax({
        url: '/ajax-image-upload',
        data: fd,
        method: 'POST',
        processData: false,
        contentType: false
    }).then(function(data) {
        $('h1').text('Upload done!');
        $('#done').html('<img src="' + data.url + '">');
        console.log(data);
    });

    return false;

});
