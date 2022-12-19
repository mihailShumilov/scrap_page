function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

function displayLoader(){
    $(".content").html("<div class=\"d-flex align-items-center m-3\" id=\"loader\">\n" +
        "        <strong>Loading...</strong>\n" +
        "        <div class=\"spinner-border ml-auto\" role=\"status\" aria-hidden=\"true\"></div>\n" +
        "    </div>");
}

$(function() {
    $('#parse-btn').on('click', function(e){
        const url = $('#link-input').val();
        if(isValidHttpUrl(url)){
            displayLoader();
            console.log({url, callback: '/callback'});
            $.ajax({
                method: "POST",
                url: '/scrap',
                contentType : 'application/json',
                data: JSON.stringify({url, callback: '/callback'}),
                success: function(data){
                    console.log('response data: ', data)
                }
            });
        }else{
            console.log('WRONg URL');
        }
    })
});