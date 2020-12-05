"use strict";

(function(){

    var PDF_TO_LOAD = null;

    function calculateZoomPercentage(scale){
        let percentage = parseInt((parseFloat(scale) * 100) - 50);
        return `${percentage}%`;
    }

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
        document.querySelector("#pdfCurrentPage").innerHTML = pagesConfig.currentPage;
        document.querySelector("#pdfLoader").style.display = "none";
        document.querySelector("#pdfContents").style.display = "block";
        document.querySelector("#zoomPercent").innerHTML = calculateZoomPercentage(pagesConfig.pageScale)
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
        const INITIAL_PAGE = 1;
        let PAGE_SCALE = 1.5;
        let CURRENT_PAGE, TOTAL_PAGES;

        async function renderPdfDocument(pdfUri, pageNo) {
            document.querySelector("#pdfLoader").style.display = "block";

            PDF_TO_LOAD = pdfjsLib.getDocument({data: pdfUri})

            PDF_TO_LOAD.promise.then(async function(pdf) {
                    CURRENT_PAGE = pageNo || INITIAL_PAGE;
                    TOTAL_PAGES = pdf.numPages;

                    const pagesConfig = {
                        currentPage: CURRENT_PAGE,
                        totalPages: TOTAL_PAGES,
                        pageScale: PAGE_SCALE
                    }
                    
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
            if(CURRENT_PAGE != TOTAL_PAGES) renderPdfDocument(pdfFromBase64, ++CURRENT_PAGE);
        }

        function returnToPreviousPage(){
            if(CURRENT_PAGE != 1) renderPdfDocument(pdfFromBase64, --CURRENT_PAGE);
        }

        function zoomIn(){
            PAGE_SCALE = PAGE_SCALE + 0.25;
            renderPdfDocument(pdfFromBase64, CURRENT_PAGE)
        }

        function zoomOut(){
            console.log("PAge scale", PAGE_SCALE)
            if (PAGE_SCALE <= 0.25) {
                return;
            }
            PAGE_SCALE = PAGE_SCALE - 0.25;
            renderPdfDocument(pdfFromBase64, CURRENT_PAGE)
        }

        renderPdfDocument(pdfFromBase64)

        document.querySelector("#previousBtn").addEventListener("click", returnToPreviousPage);
        document.querySelector("#nextBtn").addEventListener("click", goToNextPage);
        document.querySelector("#zoomInBtn").addEventListener("click", zoomIn);
        document.querySelector("#zoomOutBtn").addEventListener("click", zoomOut)
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