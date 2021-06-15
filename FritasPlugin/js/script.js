$(function(){
    $.mobile.loading().hide();

    // varP == varParam <---- para não causar conflito
    function barraFiltros(boxP, barraP, pointerP, barra_fillP, precoP, precoMaxP, precoAtualP=0){
        let isMove = false
        let valorAtual = precoAtualP
        let valorMax
        if (typeof(precoMaxP) == 'string') valorMax = Number($(precoMaxP).text().toString().replace('R$ ', '').replace('.', '').replace(',', '.'))
        else valorMax = precoMaxP
        let percent
        let barra = $(barraP)
        let pointer = $(pointerP)
        let barra_fill = $(barra_fillP)
        let preco = $(precoP)
        let box = $(boxP)
        let mx
        let barLimit = 35

        // =======================================

        function enableSelection(){
            $('body').css('-webkit-user-select', 'auto')
            $('body').css('-moz-user-select', 'auto')
            $('body').css('-ms-user-selection', 'auto')
            $('body').css('-o-user-select', 'auto')
            $('body').css('user-select', 'auto')

            $('body').css('overflow-y', 'visible')
        }

        function disableSelection(){
            $('body').css('-webkit-user-select', 'none')
            $('body').css('-moz-user-select', 'none')
            $('body').css('-ms-user-selection', 'none')
            $('body').css('-o-user-select', 'none')
            $('body').css('user-select', 'none')

            $('body').css('overflow-y', 'hidden')
        }


        // =======================================

        pointer.on('vmousedown', function(){
            isMove = true
            $(this).css('background-color', 'gray')
        })

        $(document).on('vmouseup', function(){
            isMove = false
            pointer.css('background-color', 'rgb(199, 199, 199)')
            enableSelection()
        })

        box.on('vmousemove', function(e){
            if(isMove){
                disableSelection()

                mx = e.pageX - barra.offset().left - (pointer.width()/2)

                if(mx < 0) mx = 0
                if(mx > barra.width()-35) mx = barra.width()-35

                pointer.css('margin-left', mx+'px')

                percent = (mx / (barra.width()-barLimit)) * 100
                barra_fill.css('width', percent+'%')

                valorAtual = (((percent*valorMax)/100).toFixed(2)).toString().replace('.', ',')
                preco.html('R$ '+valorAtual)
            }
        })
        

        $(window).on('resize', function(){
            percent = 0
            pointer.css('margin-left', `${0}px`)
            barra_fill.css('width', percent+'%')

            valorAtual = (((percent*valorMax)/100).toFixed(2)).toString().replace('.', ',')
            preco.html('R$ '+valorAtual)
        })
    }

    
    //                                              MODO DE USO
    //   ---> pode ser .box:first-child <---                                 ---> pode ser um número <---
    barraFiltros('.box:nth-child(1)', '#barra', '#pointer', '#barra-fill', '#preco', '#preco-max')
    

    function ajaxPost(url, box, before='<h2>Carregando...</h2>', error='<h2>Lamentamos mas ocorreu um erro  ;[</h2>'){
        $.ajax({
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // default
            'beforeSend': ()=>{
                $(box).html(before)
            },
            url: url,
            'error': ()=>{
                $(box).html(error)
            },
            'success': (data)=>{
                $(box).html(data)
            }
        })
    }

    //               MODO DE USO
    // ajaxPost('arquivo onde está o conteúdo', 'local onde vai ficar o conteúdo')
    
    ajaxPost('content.html', '.boxContent')
    
    
})
