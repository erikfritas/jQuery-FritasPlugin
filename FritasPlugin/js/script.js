$(()=>{
    // Necessário para o jQuery Mobile funcionar sem a notificação de loading...
    $.mobile.loading().hide();
    
    // TODO: code smell --> diminuir o tamanho da função
    // TODO: code smell --> diminuir a quantidade de parâmetros, para facilitar o uso.

    const enableSelection=()=>{
        $('body').css('-webkit-user-select', 'auto')
        $('body').css('-moz-user-select', 'auto')
        $('body').css('-ms-user-selection', 'auto')
        $('body').css('-o-user-select', 'auto')
        $('body').css('user-select', 'auto')

        $('body').css('overflow-y', 'visible')
    }

    const disableSelection=()=>{
        $('body').css('-webkit-user-select', 'none')
        $('body').css('-moz-user-select', 'none')
        $('body').css('-ms-user-selection', 'none')
        $('body').css('-o-user-select', 'none')
        $('body').css('user-select', 'none')

        $('body').css('overflow-y', 'hidden')
    }

    // varP == varParam <---- para não causar conflito
    // =================================  Barra Para Filtrar Preços  ================================================
    const barraFiltros = (boxP, barraP, pointerP, barra_fillP, precoP, precoMaxP=precoP+'-max', valorAtual=0)=>{
        let isMove = false
        let valorMax
        if (typeof(precoMaxP) == 'string') valorMax = Number($(precoMaxP).text().toString().replace('R$ ', '').replace('.', '').replace(',', '.'))
        else valorMax = precoMaxP

        const barra = $(barraP)
        const pointer = $(pointerP)
        const barra_fill = $(barra_fillP)
        const preco = $(precoP)
        const box = $(boxP)
        const barLimit = 35

        // =======================================

        function ctrlBar(percent, barra_fill, valorAtual, preco, mx){
            pointer.css('margin-left', `${mx}px`)
            barra_fill.css('width', percent+'%')

            valorAtual = (((percent*valorMax)/100).toFixed(2)).toString().replace('.', ',')
            preco.html('R$ '+valorAtual) 
        }

        // =======================================

        pointer.on('vmousedown', ()=>{
            isMove = true
            $(this).css('background-color', 'gray') 
        })

        $(document).on('vmouseup', ()=>{
            isMove = false
            pointer.css('background-color', 'rgb(199, 199, 199)')
            enableSelection() 
        })

        box.on('vmousemove', function(e){
            if(isMove){
                disableSelection()

                let mx = e.pageX - barra.offset().left - (pointer.width()/2)

                if(mx < 0) mx = 0
                if(mx > barra.width()-barLimit) mx = barra.width()-barLimit

                ctrlBar((mx / (barra.width()-barLimit)) * 100, barra_fill, valorAtual, preco, mx)
            } 
        })
        
        // Necessário para não causar o bug da barra acima de 100% quando redimensionamos a window
        $(window).on('resize', ()=> ctrlBar(0, barra_fill, valorAtual, preco, 0))
    }

    
    //                                     MODO DE USO
    //   ---> pode ser .box:first-child <---          
    barraFiltros('.box:nth-child(1)', '#barra', '#pointer', '#barra-fill', '#preco')
    

    //      =============================  AJAX  ========================================
    const ajaxPost=(url, box, before='<h2>Carregando...</h2>', error='<h2>Lamentamos mas ocorreu um erro  ;[</h2>')=>{
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
