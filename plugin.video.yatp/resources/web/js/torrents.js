// (c) 2015-2016 Roman Miroshnychenko
// Licence: GPL v.3: http://www.gnu.org/copyleft/gpl.html

// Start function declaration
function pause_torrents()
{
  var torrents = $('#torrents').datagrid('getSelections');
  if (torrents.length > 0)
  {
    var hashes = [];
    var i;
    for (i=0; i<torrents.length; i++)
    {
      hashes.push(torrents[i].info_hash);
    }
    $.ajax({
      type:'POST',
      url:'json-rpc',
      data:JSON.stringify({
        method:'pause_group',
        params:{info_hashes:hashes}
      }),
      contentType:'application/json; UTF-8',
      dataType:'json'
      }); // end ajax
    } // end if
} // end pause_torrents

function resume_torrents()
{
  var torrents = $('#torrents').datagrid('getSelections');
  if (torrents.length > 0)
  {
    var hashes = [];
    var i;
    for (i=0; i<torrents.length; i++)
    {
      hashes.push(torrents[i].info_hash);
    }
    $.ajax({
      type:'POST',
      url:'json-rpc',
      data:JSON.stringify({
        method:'resume_group',
        params:{info_hashes:hashes}
      }),
      contentType:'application/json; UTF-8',
      dataType:'json'
      }); // end ajax
    } // end if
} // end resume_torrent

function confirm_remove_torrents()
{
  if ($('#torrents').datagrid('getSelected') !== null)
  {
    $('#remove_torrent_dlg').dialog('open');
  } // end if
} // end confirm remove torrents

function remove_torrents()
{
  var torrents = $('#torrents').datagrid('getSelections');
  var delete_files = $('#delete_files').prop('checked');
  var hashes = [];
  var i;
  for (i=0; i<torrents.length; i++)
  {
    hashes.push(torrents[i].info_hash);
  }
  $.ajax({
    type:'POST',
    url:'json-rpc',
    data:JSON.stringify({
      method:'remove_group',
      params:{
        info_hashes:hashes,
        delete_files:delete_files}
      }),
    contentType: 'application/json; UTF-8',
    dataType: 'json'
    }); // end ajax
  $('#remove_torrent_dlg').dialog('close');
  $('#torrents').datagrid('clearSelections');
} // end remove_torrent

function add_torrent_file()
{
  var ext = $('#torr_path').filebox('getValue').split('.').pop();
  if (ext == 'torrent')
  {
    $('#add_torr_file_form').form('submit');
    $('#add_torrent_dlg').dialog('close');
  }
  else
  {
    $.messager.alert('Error','Invalid file selected!','error');
  }
}

function add_torrent_link()
{
  var torrent_link = $('#torrent_link').textbox('getValue');
  if (torrent_link && (torrent_link.slice(0, 7) == 'magnet:' || torrent_link.slice(0, 4) == 'http'))
  {
    $('#add_torr_link_form').form('submit');
    $('#add_link_dlg').dialog('close');
  }
  else
  {
    $.messager.alert('Error','Invalid torrent link!','error');
  } // end if
} // end add_magnet

function pause_all()
{
  $.ajax({
    type:'POST',
    url:'json-rpc',
    data:'{"method":"pause_all"}',
    contentType:'application/json; UTF-8',
    dataType:'json'
  }); // end ajax
} // end pause_all

function resume_all()
{
  $.ajax({
    type:'POST',
    url:'json-rpc',
    data:'{"method":"resume_all"}',
    contentType:'application/json; UTF-8',
    dataType:'json'
      }); // end ajax
} // end resume_all

function restore_downloads()
{
  var torrents = $('#torrents').datagrid('getSelections');
  if (torrents.length > 0)
  {
    var hashes = [];
    var i;
    for (i=0; i<torrents.length; i++)
    {
      if (torrents[i].state == 'incomplete')
      {
        hashes.push(torrents[i].info_hash);
      }
    }
    $.ajax({
      type:'POST',
      url:'json-rpc',
      data:JSON.stringify({
        method:'restore_downloads',
        params:{info_hashes:hashes}
      }),
      contentType:'application/json; UTF-8',
      dataType:'json'
    }); // end ajax
    } // end if
} // end restore_donwloads

function grid_refresh()
{
    $('#torrents').datagrid('reload'); // reload grid
    $('#torrents').datagrid('loaded'); // hide 'loading' message
} // end grid_refresh

// Start JQuery document_ready
$(function()
{
  $('#torrents').attr('title','Torrents on ' + window.location.host);
  $('#torrents').datagrid({
    singleSelect:false,
    ctrlSelect:true,
    url:'torrents-json',
    method:'get',
    idField:'info_hash',
    rownumbers:true,
    loadMsg: 'Loading torrents data...',
    sortName:'added_time',
    remoteSort:false,
    toolbar:'#toolbar',
    onLoadSuccess:function()
    {
      setTimeout(grid_refresh, 2000);
    },
    onLoadError:function()
    {
      $.messager.alert('Error','Unable to load torrent data!','error');
    },
    columns:[[
      {field:'name',title:'Torrent Name',sortable:true,width:400},
      {field:'size',title:'Size (MB)',sortable:true,width:70,align:'right'},
      {field:'state',title:'State',sortable:true,width:100},
      {field:'progress',title:'%',width:35,align:'right'},
      {field:'dl_speed',title:'DL (KB/s)',width:70,align:'right'},
      {field:'ul_speed',title:'UL (KB/s)',width:70,align:'right'},
      {field:'total_download',title:'Total DL (MB)',width:90,align:'right'},
      {field:'total_upload',title:'Total UL (MB)',width:90,align:'right'},
      {field:'num_seeds',title:'Seeds',width:50,align:'right'},
      {field:'num_peers',title:'Peers',width:50,align:'right'},
      {field:'added_time',title:'Added on',sortable:true,width:150},
      {field:'completed_time',title:'Completed on',sortable:true,width:150},
      {field:'info_hash',title:'Hash',width:1,hidden:true}
      ]] // end columns
    }); // end datagrid
  $('#add_torrent_dlg').dialog({
    title: 'Add .torrent file',
    iconCls: 'icon-torrent-add',
    width: 450,
    height: 200,
    closed: true,
    modal: true,
    onClose:function()
    {
      $('#torr_path').filebox('clear');
      $('#file_sub_path').textbox('clear');
      $('#file_paused').prop('checked',false);
    },
    buttons: [{
      text: 'Add',
      iconCls: 'icon-ok',
      handler: add_torrent_file
        }, // end button
        {
          text: 'Cancel',
          handler: function()
          {
            $('#add_torrent_dlg').dialog('close');
          } // end function
        } // end button
      ] // end buttons
    }); // end dialog
  $('#add_link_dlg').dialog({
    title: 'Add torrent link',
    iconCls: 'icon-link-add',
    width: 450,
    height: 200,
    closed: true,
    modal: true,
    onClose:function()
    {
      $('#torrent_link').textbox('clear');
      $('#link_sub_path').textbox('clear');
      $('#link_paused').prop('checked',false);
    }, // end function
    buttons: [{
      text: 'Add',
      iconCls: 'icon-ok',
      handler: add_torrent_link
        }, // end button
        {
          text: 'Cancel',
          handler: function()
          {
            $('#add_link_dlg').dialog('close');
          } // end function
        } // end button
      ] // end buttons
    }); // end dialog
  $('#remove_torrent_dlg').dialog({
    title: 'Confirm delete torrents',
    iconCls: 'icon-delete',
    width: 400,
    height: 180,
    closed: true,
    modal: true,
    onClose:function()
    {
      $('#delete_files').prop('checked',false);
    },
    buttons: [{
      text: 'Delete',
      iconCls: 'icon-ok',
      handler: remove_torrents
        }, // end button
        {
          text: 'Cancel',
          handler: function()
          {
            $('#remove_torrent_dlg').dialog('close');
            } // end function
        } // end button
      ] // end buttons
    }); // end dialog
  $(window).resize(function()
  {
    $('#torrents').datagrid('resize');
    $('#toolbar').panel('resize');
  }
    ); // end window resize
//    grid_refresh();
}); // end document_ready
