function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

function displayLoader(selector){
    $(selector).html("<div class=\"d-flex align-items-center m-3\" id=\"loader\">\n" +
        "        <strong>Loading...</strong>\n" +
        "        <div class=\"spinner-border ml-auto\" role=\"status\" aria-hidden=\"true\"></div>\n" +
        "    </div>");

}

function encodeHTMLEntities(text) {
    return $("<textarea/>").text(text).html();
}

$(function() {
    let shortText, fullText;
    const socket = io();

    // client-side
    socket.on("connect", () => {
        // console.log('connect: ', socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("disconnect", () => {
        // console.log('disconnect: ', socket.id); // undefined
    });

    socket.on("html", (data)=>{
        console.log('data from socket: ', data);
        let selector = '.content';
        if(data.mode === 'short'){
            selector += ' .left';
            shortText = data.data;
        }else{
            selector += ' .right';
            fullText = data.data;
        }
        $(selector).html('<div class="pre-scrollable border p-3 m-3"><pre><code>'+encodeHTMLEntities(data.data)+'</code></pre></div>');
        if(shortText && fullText){
            doDiff();
        }
    });

    function doDiff(){
        $.ajax({
            method: "POST",
            url: '/diff',
            contentType : 'application/json',
            data: JSON.stringify({textLeft: shortText, textRight: fullText}),
            success: function(data){
                console.log('response diff data: ', data);
                const fragment = document.createDocumentFragment();

                data.diffs.forEach(function(part){
                    // green for additions, red for deletions
                    // grey for common parts
                    color = part.added ? 'green' :
                        part.removed ? 'red' : 'grey';
                    span = document.createElement('div');
                    span.style.color = color;
                    span.appendChild(document
                        .createTextNode(part.value));
                    fragment.appendChild(span);
                });

                $('.content .diff').html('<div class="pre-scrollable border p-3 m-3"><pre><code id="diffCode"></code></pre></div>');
                $('#diffCode').html(fragment);
            }
        });
    }


    $('#parse-btn').on('click', function(e){
        shortText = '';
        fullText = '';
        const url = $('#link-input').val();
        if(isValidHttpUrl(url)){
            displayLoader(".content .left");
            displayLoader(".content .right");
            displayLoader(".content .diff");
            const requestData = {url, callback: window.location.href + 'callback', socketId: socket.id, mode: 'short', pretty: true};
            const requestDataFull = {url, callback: window.location.href + 'callback', socketId: socket.id, mode: 'full', pretty: true};
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
            $.ajax({
                method: "POST",
                url: '/scrap',
                contentType : 'application/json',
                data: JSON.stringify(requestDataFull),
                success: function(data){
                    console.log('response data: ', data)
                }
            });
        }else{
            console.log('WRONg URL');
        }
    })
});