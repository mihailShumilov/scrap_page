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

function encodeHTMLEntities(text) {
    return $("<textarea/>").text(text).html();
}

$(function() {
    const socket = io();

    // client-side
    socket.on("connect", () => {
        // console.log('connect: ', socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("disconnect", () => {
        // console.log('disconnect: ', socket.id); // undefined
    });

    socket.on("html", (data)=>{
        // console.log('data from socket: ', data);
        $(".content").html('<div class="pre-scrollable border p-3 m-3"><pre><code>'+encodeHTMLEntities(data)+'</code></pre></div>');
    });


    $('#parse-btn').on('click', function(e){
        const url = $('#link-input').val();
        if(isValidHttpUrl(url)){
            displayLoader();
            const requestData = {url, callback: window.location.href + 'callback', socketId: socket.id};
            // console.log(requestData);
            $.ajax({
                method: "POST",
                url: '/scrap',
                contentType : 'application/json',
                data: JSON.stringify(requestData),
                success: function(data){
                    console.log('response data: ', data)
                }
            });
        }else{
            console.log('WRONg URL');
        }
    })
});