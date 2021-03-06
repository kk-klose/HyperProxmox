/**
 * Created by tlams on 10/11/16.
 */

$(document).ready(function()
{
    /* MAC ADDR Tooltip */
    $('[data-toggle="tooltip"]').tooltip({
        'selector': '',
        'placement': 'left',
        'container':'body'
    });

    /* ARRAY CONFIGURATION */
    $('#dataTables-storages').DataTable( {
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "all"]],
        "paging":   true,
        "searching": true,
        "ordering": true,
        "info":     true,

        responsive: {
            details: {
                type: 'inline',
                target: 'tr'
            }
        },
        columnDefs: [ {
            className: 'control',
            orderable: false,
            targets:   0
        } ],
        order: [ 1, 'asc' ]
    } );


    $('#dataTables-cluster').DataTable( {
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "all"]],
        "paging":   true,
        "searching": true,
        "ordering": true,
        "info":     true,

        responsive: {
            details: {
                type: 'inline',
                target: 'tr'
            }
        },
        columnDefs: [ {
            className: 'control',
            orderable: false,
            targets:   0
        } ],
        order: [ 1, 'asc' ]
    } );


    $('#dataTables-hypervisors').DataTable( {
        "lengthMenu": [[25, 50, 100, 500, -1], [25, 50, 100, 500, "all"]],
        "paging":   true,
        "searching": true,
        "ordering": true,
        "info":     true,

        responsive: {
            details: {
                type: 'inline',
                target: 'tr'
            }
        },

        columnDefs: [ {
            className: 'control',
            orderable: false,
            targets:   0
        }
        ],
        order: [ 1, 'asc' ]
    } );


    $('#dataTables-hypervisor').DataTable( {
        "paging":   false,
        "searching": false,
        "ordering": false,
        "info":     true,

        responsive: {
            details: {
                type: 'inline',
                target: 'tr'
            }
        },
        columnDefs: [ {
            className: 'control',
            orderable: false,
            targets:   0
        } ],
        order: [ 2, 'asc' ]
    } );



    $('.dataTables-vm').DataTable({
        "lengthMenu": [[25, 50, 100, 500, -1], [25, 50, 100, 500, "all"]],
        "paging":   true,
        "searching": true,
        "ordering": true,
        "info":     true,
        "pagingType": "simple_numbers",

        responsive: {
            details: {
                type: 'column',
                target: 'tr'
            }
        },
        columnDefs: [ {
            className: 'control',
            orderable: false,
            targets:   0
        } ],
        order: [ 1, 'asc' ]
    } );

    $( function()
    {

        /* VM GESTION */
		function sendrequest() 
		{
			
            var action = $( "#action" );
            var id = $( "#bbaction" );
            var box = $('.result');
            
            var commandinfo = "The status available in the table is not dynamically update, you must wait the next cron rotate. <br /> You can play the status command to have an updated informations";
            box.html('<center> <img src="images/icon-load.gif"  height="60" width="60"></center>');

            $.ajax({
                url: 'requires/pveaction.php?id='+id.val()+'&action='+action.val(),
                type : 'GET',
                timeout: 32000,
                success: function (data) {
                    box.html('<div class="alert alert-info"> <strong>Command return: </strong> '+data+' <br /> '+ commandinfo +'</div>');
                },
                error: function() {
                    box.html('<div class="alert alert-danger"> <strong>Error: </strong> Command failed, try again or contact an true admin. </div>');
                }
            });
        }

        /* NODE NON GRATA */

        function nongrataswitch(node, action) {
            // J'initialise le variable box
            var box = $('.result');
            var commandinfo = "This information will be automatic applied in the next update.";
            box.html('<center> <img src="images/icon-load.gif"  height="60" width="60"></center>');
            var divid = '#'+node;
            // Je définis ma requête ajax
            $.ajax({

                // Adresse à laquelle la requête est envoyée
                url: 'requires/pcmaction.php',
                type : 'POST',
                data : 'node=' + node + '&action=' + action,
                // Le délai maximun en millisecondes de traitement de la demande
                timeout: 32000,

                // La fonction à apeller si la requête aboutie
                success: function (data) {
                    // Je charge les données dans box
                    box.html('<div class="alert alert-info"> <strong>information: </strong>' + commandinfo);

                    if (data == "sw_OFF")
                        $(divid).html('<a class="nongratalink" data-toggle="tooltip" title="Switch to non grata" id="'+node+'"  action="sw_OFF" node="'+node+'"  href="#" > <img src="images/nongrata_off.png" alt="Nongrataimg" style="width:16px;height:16px;"/></a>');
                    else if (data == "sw_ON")
                        $(divid).html('<a class="nongratalink" data-toggle="tooltip" title="Switch to grata" id="'+node+'"  action="sw_ON" node="'+node+'"  href="#" > <img src="images/nongrata_on.png" alt="Nongrataimg" style="width:16px;height:16px;"/></a>');
                    else
                        $(divid).html(':(');
                },

                // La fonction à appeler si la requête n'a pas abouti
                error: function() {
                    // J'affiche un message d'erreur
                    box.html('<div class="alert alert-danger"> <strong>Error: </strong> Command failed, try again or contact an administrator. </div>');
                }

            });

            dialog.dialog( "close" );
        }

        $('.nongratalink').click(function() {
            var node = $(this).attr('node');
            var action = $(this).attr('action');
            nongrataswitch(node, action);
            return false; // return false so the browser will not scroll your page
        });
        /* NEWVM -- SEARCH NODES */
        
        
        $('#bbaction').on('click', function(event) {
        	  event.preventDefault(); // To prevent following the link (optional)
        	  sendrequest();
        });
 

        function newvm() {
            // J'initialise le variable box
            var box = $('#result');
            var cpu = $( "#cpu" );
            var ram = $( "#ram" );
            var disk = $( "#disk" );
            var cluster = $( "#enableClickableOptGroups" );

            box.html('<center> <img src="images/icon-load.gif"  height="60" width="60"> <br>Please wait... can take more than 1 minute</center> ');
            $.ajax({

                // Adresse à laquelle la requête est envoyée
                url: 'requires/newvm.php',
                type : 'POST',
                data : 'cpu=' + cpu.val() + '&ram=' + ram.val() + '&disk=' + disk.val() + '&cluster=' + cluster.val(),
                // Le délai maximun en millisecondes de traitement de la demande
                timeout: 500000,

                // La fonction à apeller si la requête aboutie
                success: function (data) {
                    // Je charge les données dans box
                    box.html(data);
                },

                // La fonction à appeler si la requête n'a pas abouti
                error: function() {
                    // J'affiche un message d'erreur
                    box.html('<div class="alert alert-danger"> <strong>Error: </strong> Command failed, try again or contact an admin. </div>');
                }
            });
        }

        $("#buttonnewvm").click(newvm);

    });
} );