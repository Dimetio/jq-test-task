$(document).ready(function () {

  var dateArr = []; // массив, куда пойдет дата
  var range = $('#range');
  var search = $('#search');
  var input = $('#input');

  $('button').click(function (e) {
    e.preventDefault();
    var url = 'json.json';
    //var url = input.val();

    $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      dataType: 'json',
      success: function (response) {
        clearTable();
        createTable(response);

        // снимает disabled с инпутов
        range.prop('disabled', false);
        search.prop('disabled', false);
      },
    });
  });

  function createTable(data) {
    var i = 1;

    data.map(function (el) {
      $('table tbody').append(`
      <tr>
        <td>${i}</td>
        <td>${el.name}</td>
        <td>${el.birthdate}</td>
        <td>${el.email}</td>
      </tr>`);

      i++;

      // пушает даты в массив
      dateArr.push(el.birthdate.split('-').join(''));
    });

    checkDate(dateArr);
  }

  function checkDate(arr) {
    // вычисляет min и max даты
    var today = new Date().getFullYear();
    var min = Math.min(...arr).toString().substr(0, 4);
    var max = Math.max(...arr).toString().substr(0, 4);
    var minAge = today - max;
    var maxAge = today - min;

    // меняет арртибуты min и max
    range.attr('min', min);
    range.attr('max', max);

    //выводит выбранный год
    range.on('input', (() => {
      $('.change_range--year').html(range.val())
    }));

    // выводит мин/макс года
    range.on('input', (() => {
      $('.change_range--age').html(`Возрат: от ${minAge} до ${maxAge}`)
    }));
  }

  var newArr = [];
  // живой поиск по таблице
  function updateTable(value) {
    $('.table tbody tr').filter(function () {
      if ($(this).text().toLowerCase().indexOf(value) > -1) {
        newArr.push($(this).text().replace(/\r?\n/g, "").replace(/\s+/g, ', '))
      }
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  }

  // получает value по отжатию клавиши и обновляет таблицу
  search.keyup(function () {
    var value = $(this).val().toLowerCase();

    updateTable(value);
  });

  // получает value по отжатию мыши и обновляет таблицу
  range.mouseup(function () {
    var value = $(this).val().toLowerCase();

    updateTable(value);
  });

  // чистит таблицу
  function clearTable() {
    $('table tbody tr').remove();
  }
});