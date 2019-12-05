//Page Ready Functions
$(document).ready(function () {
    //For navigating through older funnels in Dashboard
    $('#spanPrevious').click(function () {
        if ($('#svgGraph').css('display') == 'inline') {
            $('#svgGraph').hide('slide', { direction: 'right' }, 800, function () {
                $('#lblModuleHeader').html('Maturation Funnel - June 2017');
                $('#imgFunnel3').show('slide', { direction: 'left' }, 800, function () {
                    $('#imgFunnel1').css('display', 'none');
                    $('#imgFunnel2').css('display', 'none');
                    $('#svgGraph').css('display', 'none');
                    $('#divNext').removeClass('navigationButtonsDisabled');
                    $('#divNext').addClass('navigationButtons');
                });
            });

        }
        else if ($('#imgFunnel3').css('display') == 'inline') {
            $('#imgFunnel3').hide('slide', { direction: 'right' }, 800, function () {
                $('#lblModuleHeader').html('Maturation Funnel - November 2016');
                $('#imgFunnel2').show('slide', { direction: 'left' }, 800, function () {
                    $('#imgFunnel1').css('display', 'none');
                    $('#imgFunnel3').css('display', 'none');
                    $('#svgGraph').css('display', 'none');
                    $('#divNext').removeClass('navigationButtonsDisabled');
                    $('#divNext').addClass('navigationButtons');
                });
            });
        }
        else if ($('#imgFunnel2').css('display') == 'inline') {
            $('#imgFunnel2').hide('slide', { direction: 'right' }, 800, function () {
                $('#lblModuleHeader').html('Maturation Funnel - June 2015');
                $('#imgFunnel1').show('slide', { direction: 'left' }, 800, function () {
                    $('#imgFunnel2').css('display', 'none');
                    $('#svgGraph').css('display', 'none');
                    $('#imgFunnel3').css('display', 'none');
                    $('#divPrevious').removeClass('navigationButtons');
                    $('#divPrevious').addClass('navigationButtonsDisabled');
                });
            });
        }
    });

    //For navigating through older funnels in Dashboard
    $('#spanNext').click(function () {
        if ($('#imgFunnel1').css('display') == 'inline') {
            $('#imgFunnel1').hide('slide', { direction: 'left' }, 800, function () {
                $('#lblModuleHeader').html('Maturation Funnel - November 2016');
                $('#imgFunnel2').show('slide', { direction: 'right' }, 800, function () {
                    $('#imgFunnel1').css('display', 'none');
                    $('#svgGraph').css('display', 'none');
                    $('#imgFunnel3').css('display', 'none');
                    $('#divPrevious').removeClass('navigationButtonsDisabled');
                    $('#divPrevious').addClass('navigationButtons');
                });
            });
        }
        else if ($('#imgFunnel2').css('display') == 'inline') {
            $('#imgFunnel2').hide('slide', { direction: 'left' }, 800, function () {
                $('#lblModuleHeader').html('Maturation Funnel - June 2017');
                $('#imgFunnel3').show('slide', { direction: 'right' }, 800, function () {
                    $('#imgFunnel2').css('display', 'none');
                    $('#imgFunnel1').css('display', 'none');
                    $('#svgGraph').css('display', 'none');
                    $('#divPrevious').removeClass('navigationButtonsDisabled');
                    $('#divPrevious').addClass('navigationButtons');
                });
            });
        }
        else if ($('#imgFunnel3').css('display') == 'inline') {
            $('#imgFunnel3').hide('slide', { direction: 'left' }, 800, function () {
                $('#lblModuleHeader').html('Maturation Funnel - September 2018');
                $('#svgGraph').show('slide', { direction: 'right' }, 800, function () {
                    $('#imgFunnel3').css('display', 'none')
                    $('#imgFunnel2').css('display', 'none')
                    $('#imgFunnel1').css('display', 'none')
                    $('#divNext').removeClass('navigationButtons');
                    $('#divNext').addClass('navigationButtonsDisabled');
                });
            });
        }
    });

    //For hiding the Data Type Table
    $('#imgArrow').click(function (event) {
        $('#datatypeTable').hide('slide', { direction: 'right' }, 500, function () {
            $("#divSVG").switchClass("col-lg-9", "col-lg-12", 500, "easeInOutQuad", function () {
                if ($('#page-container').hasClass('fade page-sidebar-fixed page-header-fixed page-with-wide-sidebar in page-sidebar-minified')) {
                    $('#page-container').removeClass('fade page-sidebar-fixed page-header-fixed page-with-wide-sidebar in page-sidebar-minified');
                    $('#page-container').addClass('fade page-sidebar-fixed page-header-fixed page-with-wide-sidebar in');

                }
                $('#divNavigation').css('display', 'block');
            });
        });
    });

    //Click for Bubbles in Maturation Funnel
    $("g").click(function (event) {
        var classToCompare = ['NewOilLegend', 'WRMLegend', 'HCMLegend', 'ExplorationLegend'];
        if (($(event.target)[0].id.split('_')[0].indexOf('lgndTxt') < 0)) {
            if (classToCompare.indexOf($(event.target).attr('class')) < 0) {
                if ($('#page-container').hasClass('fade page-sidebar-fixed page-header-fixed page-with-wide-sidebar in')) {
                    $('#page-container').removeClass('fade page-sidebar-fixed page-header-fixed page-with-wide-sidebar in');
                    $('#page-container').addClass('fade page-sidebar-fixed page-header-fixed page-with-wide-sidebar in page-sidebar-minified');
                }
                $("#divSVG").switchClass("col-lg-12", "col-lg-9", 300, "easeInOutQuad");
                if ((event.target).id.indexOf('textAppend') >= 0) {
                    GetDataTypeDetailsLink((event.target).id.split('_')[1]);
                }
                else {
                    if ($(event.target).prop('nodeName').toLowerCase() != 'tspan') {
                        getDataTypeDetailsById((event.target).id.split('_')[1]);
                    }
                    else {
                        if ((event.target).parentNode.id == '') {
                            getDataTypeDetailsById((event.target).id.split('_')[1]);
                        }
                        else {
                            getDataTypeDetailsById((event.target).parentNode.id.split('_')[1]);
                        }
                    }
                }
                $("#datatypeTable").css("display", "block");
                $('#divNavigation').css('display', 'none');
            }
            else {
                getBubbleDescription((event.target).id.split('_')[1]);
            }
        }
        else {
            getBubbleDescription((event.target).id.split('_')[1]);
        }
    });

    //i Button click above the funnel
    $('#btnInfo').click(function (event) {
        $.ajax({
            type: "POST",
            url: window.location.origin + "/" + appName + "/WebMethods/CommonWebMethods.asmx/GetCommonLinks",
            data: "{}",
            dataType: "json",
            cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var jsonData = JSON.parse(data.d);
                var trChild = '';
                $('#tableCommonLinks').empty();
                var trHeader = '<tr><th>DISCIPLINE</th><th>DATA / DISCIPLINE STANDARD</th><th>Document - Last Update</th><th>DOCUMENT DESCRIPTION</th></tr>';
                $.each(jsonData, function (i, item) {
                    trChild += '<tr><td>' + jsonData[i].Discipline + '</td><td><a href="' + jsonData[i].Hyperlink + '">' + jsonData[i].Data_Discipline_Standard + '</a></td><td>' + jsonData[i].LastUpdate + '</td><td>' + jsonData[i].Document_Description + '</td></tr>';
                });
                $('#tableCommonLinks').append(trHeader).append(trChild);
            },
            error: function (response) {
                alert(response.responseText);
            },
            failure: function (response) {
                alert(response.responseText);
            }
        });
        $('#myModal').modal('show');
    });
});

//For binding legend bubble description to table
var groupColumn = 0;
var bindBubbleDescription = function (result) {
    $('#modalBubblesDesc').modal('show');
    $('#tableBubbleDesc').DataTable({
        "destroy": true,
        "bLengthChange": false,
        "searching": false,
        "data": result.Table,
        "columns": [
            { "data": "BUBBLE_NAME", "title": "Bubble Name", "className": "clsBubbleName" },
            { "data": "PE_PROCESS_OWNER", "title": "Process Owner", "className": "clsProcessOwner" },
            { "data": "DESCRIPTION", "title": "Description", "className": "clsDescription" },
            {
                "data": "LINK",
                "render": function (data, type, row, meta) {
                    return '<a href="' + data + '" target="_blank">' + data + '</a>';
                },
                "title": "Link", "className": "clsLink"
            }
        ],
        "columnDefs": [
        {
            "targets": [0],
            "visible": false,
        },
        {
            "targets": [1],
        }, {
            "targets": [2],
        }, {
            "targets": [3],
        }
        ],
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        '<tr class="group"><td colspan="4">' + group + '</td></tr>'
                    );

                    last = group;
                }
            });
        },
    });
};

/* Ajax Call for Bubble Description
------------------------------------------------ */
var getBubbleDescription = function (bubbleName) {
    $.ajax({
        url: window.location.origin + "/" + appName + "/WebMethods/CommonWebMethods.asmx/GetBubbleData",
        data: "{'BubbleName':'" + bubbleName + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            bindBubbleDescription(JSON.parse(data.d));
        },
        error: function (response) {
        }
    });
};

/* Ajax Call for Data Types by ID
------------------------------------------------ */
var getDataTypeDetailsById = function (id) {
    $.ajax({
        url: window.location.origin + "/" + appName + "/WebMethods/CommonWebMethods.asmx/GetDataTypeDetailsById",
        data: "{'DataTypeId':'" + id + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: handleData,
        error: function (response) {
            $("#tdDataType").html("No Data Available for this DataType");
            $("#tdDescription").html('');
            $("#tdMaturityLevel").html('');
            $("#tdOwner").html('');
            $("#tdDataSource").html('');
            $("#tdBrowser").html('');
            $("#tdContact").html('');
            $('#tdStandard').html('');
        },
        failure: function (response) {
        }
    });
};

/* Ajax Call for Data Types Table
------------------------------------------------ */
var GetDataTypeDetailsLink = function (id) {
    $.ajax({
        url: window.location.origin + "/" + appName + "/WebMethods/CommonWebMethods.asmx/GetDataTypeDetailsLink",
        data: "{'DataTypeId':'" + id + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: handleDataForLink,
        error: function (response) {
            $("#tdDataType").html("No Data Available for this DataType");
            $("#tdDescription").html('');
            $("#tdMaturityLevel").html('');
            $("#tdOwner").html('');
            $("#tdDataSource").html('');
            $("#tdBrowser").html('');
            $("#tdContact").html('');
            $('#tdStandard').html('');
        },
        failure: function (response) {
        }
    });
};

/* Setting data for the DataTypes Table Links
------------------------------------------------ */
var handleDataForLink = function (jsonObj) {
    var data = JSON.parse(jsonObj.d);
    $("#tdDataType").html(data.DataType);
    $("#tdDescription").html(data.DataType_Description);
    $("#tdMaturityLevel").html(data.FunnelPhase);
    $("#tdOwner").html(data.Main_PE_XD_Team);
    $("#tdDataSource").html(data.Solution_DB_Name);
    $("#tdEvolution").html('');
    if (data.DataEvolution_Link.indexOf(',') > 0) {
        $('#tdEvolution').wrapInner('<a class="aEvolutionFrmFnl" target="_blank">' + data.DataEvolution_Link.split(',')[0] + ', </a><a class="aEvolutionFrmFnl" target="_blank">' + data.DataEvolution_Link.split(',')[1] + '</a>');
    }
    else {
        $("#tdEvolution").html('<a class="aEvolutionFrmFnl">' + data.DataEvolution_Link + '</a>');
    }
    if (data.Browser_Link != '') {
        $("#tdBrowser").html('');
        $("#tdBrowser").wrapInner('<a href="' + data.Browser_Link + '" target="_blank">' + data.Solution_Browsing + '</a>');
    }
    else {
        $("#tdBrowser").html('');
        $("#tdBrowser").html(data.Solution_Browsing);
    }
    if (data.UPM_Contact != '') {
        $('#tdContact').html('');
        $('#tdContact').wrapInner('<a href="mailto:' + data.UPM_Contact_Email + '&subject=Regarding ' + data.DataType + ' Data">' + data.UPM_Contact + '</a>');
    }
    else {
        $('#tdContact').html('');
    }
    if (data.SOP_Link[0] != '') {
        $('#tdStandard').html('');
        if (data.SOP_Link[0].indexOf(',') > 0) {
            var linkValue = data.SOP_Link[0];
            var hyperLink = data.SOP_HyperLink[0];
            $('#tdStandard').wrapInner('<a href="' + hyperLink.split(',')[0] + '" target="_blank">' + linkValue.split(',')[0] + ', </a><a href="' + hyperLink.split(',')[1] + '" target="_blank">' + linkValue.split(',')[1] + '</a>');
        }
        else {
            var innerHTMLVal = '';
            for (i = 0; i < data.SOP_Link.length; i++) {
                innerHTMLVal = innerHTMLVal + '<a href="' + data.SOP_HyperLink[i] + '" target="_blank">' + data.SOP_Link[i] + '</a><br>';
            }
            $('#tdStandard').wrapInner(innerHTMLVal);
        }
    }
    else {
        $('#tdStandard').html('');
    }
    //For Data Evolution Item click
    $(".aEvolutionFrmFnl").click(function (e) {
        var clickedOption = $(event.target)[0].innerHTML;
        if ($(location).attr('pathname') != '/Pages/DataEvolution') {

            window.open("/Pages/DataEvolution");
            sessionStorage.setItem("selectedOption", clickedOption);
        }
        else {
            $("#ddlMaturityLevel").val(clickedOption);
            $("#ddlMaturityLevel").trigger("change");
        }
    });
};

/* Setting data for the DataTypes Table
------------------------------------------------ */
var handleData = function (jsonObj) {
    var data = JSON.parse(jsonObj.d);
    $("#tdDataType").html(data.DataType.toUpperCase());
    $("#tdDescription").html(data.DataType_Description);
    $("#tdMaturityLevel").html(data.FunnelPhase);
    $("#tdOwner").html(data.Main_PE_XD_Team);
    $("#tdDataSource").html(data.Solution_DB_Name);
    $("#tdEvolution").html('');
    if (data.DataEvolution_Link.indexOf(',') > 0) {
        $('#tdEvolution').wrapInner('<a class="aEvolutionFrmFnl" target="_blank">' + data.DataEvolution_Link.split(',')[0] + ', </a><a class="aEvolutionFrmFnl" target="_blank">' + data.DataEvolution_Link.split(',')[1] + '</a>');
    }
    else {
        $("#tdEvolution").html('<a class="aEvolutionFrmFnl">' + data.DataEvolution_Link + '</a>');
    }
    if (data.Browser_Link != '') {
        $("#tdBrowser").html('');
        $("#tdBrowser").wrapInner('<a href="' + data.Browser_Link + '"  target="_blank">' + data.Solution_Browsing + '</a>');
    }
    else {
        $("#tdBrowser").html('');
        $("#tdBrowser").html(data.Solution_Browsing);
    }
    if (data.UPM_Contact != '') {
        $('#tdContact').html('');
        $('#tdContact').wrapInner('<a href="mailto:' + data.UPM_Contact_Email + '&subject=Regarding ' + data.DataType + ' Data">' + data.UPM_Contact + '</a>');
    }
    else {
        $('#tdContact').html('');
    }
    if (data.SOP_Link[0] != '') {
        $('#tdStandard').html('');
        if (data.SOP_Link[0].indexOf(',') > 0) {
            var linkValue = data.SOP_Link[0];
            var hyperLink = data.SOP_HyperLink[0];
            $('#tdStandard').wrapInner('<a href="' + hyperLink.split(',')[0] + '"  target="_blank">' + linkValue.split(',')[0] + ', </a><a href="' + hyperLink.split(',')[1] + '"  target="_blank">' + linkValue.split(',')[1] + '</a>');
        }
        else {
            $('#tdStandard').wrapInner('<a href="' + data.SOP_HyperLink + '"  target="_blank">' + data.SOP_Link + '</a>');
        }
    }
    else {
        $('#tdStandard').html('');
    }
    //For Data Evolution Item click
    $(".aEvolutionFrmFnl").click(function (e) {
        var clickedOption = $(event.target)[0].innerHTML.split(',')[0];
        sessionStorage.setItem("selectedOption", clickedOption);
        window.open(window.location.origin + "/" + appName + "/Pages/DataEvolution", "_blank");
        //window.location.href = window.location.origin + "/" + appName + "/Pages/DataEvolution";
    });

}
