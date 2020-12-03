"use strict";

(function(){

    var PDF_TO_LOAD = null;

    function getCanvasContext(page, canvas, pageScale){
        let viewport = page.getViewport({scale: pageScale});
        let context = canvas.getContext("2d");
    
        canvas.height = viewport.height;
        canvas.width = viewport.width;
    
        let renderContext = {
            canvasContext: context,
            viewport: viewport
        };
    
        return renderContext;
    }

    function afterRenderCallback(pagesConfig){
        console.log("pagesConfig", pagesConfig)
        document.querySelector("#pdfCurrentPage").innerHTML = pagesConfig.currentPage;
        document.querySelector("#pdfLoader").style.display = "none";
        document.querySelector("#pdfContents").style.display = "block";
        if(pagesConfig.totalPages){
            document.querySelector("#pdfTotalPages").innerHTML = ` / ${pagesConfig.totalPages}`
        }
    }
    
    async function renderPage(page, context, pagesConfig){
        const renderTask = page.render(context);
    
        try {
            await renderTask;
            afterRenderCallback(pagesConfig)
        }catch(e){
            throw new Error(e);
        }
    }

    document.addEventListener("DOMContentLoaded", function(event){
        
        const pdfFromBase64 = atob(document.getElementsByName('pdfAsBase64')[0].content);

        const CANVAS = document.querySelector("#pdfCanvas");
        const PAGE_SCALE = 1.5;
        const INITIAL_PAGE = 1;
        let CURRENT_PAGE, TOTAL_PAGES;

        async function showPDF(pdfUri, pageNo) {
            document.querySelector("#pdfLoader").style.display = "block";

            PDF_TO_LOAD = pdfjsLib.getDocument({data: pdfUri})

            PDF_TO_LOAD.promise.then(async function(pdf) {
                    CURRENT_PAGE = pageNo || INITIAL_PAGE;
                    TOTAL_PAGES = pdf.numPages;

                    const pagesConfig = {currentPage: CURRENT_PAGE, totalPages: TOTAL_PAGES}
                    
                    await pdf.getPage(CURRENT_PAGE).then(async function(page) {
                        const renderContext = getCanvasContext(page, CANVAS, PAGE_SCALE);
                        await renderPage(page, renderContext, pagesConfig);
                    });
                }, function (error) {
                    console.error(error);
                }
            );
        }

        function goToNextPage(){
            if(CURRENT_PAGE != TOTAL_PAGES) showPDF(pdfFromBase64, ++CURRENT_PAGE);
        }

        function returnToPreviousPage(){
            if(CURRENT_PAGE != 1) showPDF(pdfFromBase64, --CURRENT_PAGE);
        }

        showPDF(pdfFromBase64)

        document.querySelector("#previousBtn").addEventListener("click", returnToPreviousPage);

        document.querySelector("#nextBtn").addEventListener("click", goToNextPage);

        document.onkeydown = function(e){
            e = e || window.event;
            
            switch(e.keyCode){
                case 37:
                    if(PDF_TO_LOAD !== null){
                        returnToPreviousPage()
                    }
                    return;
                case 39:
                    if(PDF_TO_LOAD !== null){
                        goToNextPage()
                    }
                    return;
                case 38:
                    return;
                case 40:
                    return;
                default:
                    return;
            }
        }

    })
})()