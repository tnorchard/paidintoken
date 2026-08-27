

price_list = [];





$.get('last_price_file', function(response) {
    // console.log(response);
    full_data_load = response.split("\n");


		// price_list.push(last_price_load);

		// last_price_load = price_list.slice(-1)

		// try {
		// 	last_price_load = price_list.slice(-1)
		// 	console.log(price_list.slice(-1));
		// } 
		// catch  {
		// 	console.log('no way');
		// }

		if (price_list.slice(-1) == '') {
			last_price_load = full_data_load[0];
		} else {
			last_price_load = price_list.slice(-1)
		}

	    last_price_load = full_data_load[0];
	    day_high_load = full_data_load[1];
	    day_low_load = full_data_load[2];

		last_price_item =Number(last_price_load).toLocaleString("en-US")
		day_high_item = Number(day_high_load).toLocaleString("en-US")
		day_low_item = Number(day_low_load).toLocaleString("en-US")

		$("[name='last_price']").text(last_price_item);
		$("[id='day_high']").text(day_high_item);
		$("[id='day_low']").text(day_low_item);

		// document.getElementById("day_high").onmouseover = function() {mouseOver_high()};
		// document.getElementById("day_high").onmouseout = function() {mouseOut_high()};


		// function mouseOver_high() {
		//   last_price = full_data[1];
		//   console.log(last_price);
		// }

		// function mouseOut_high() {
		//   last_price = full_data[0];
		//   console.log(last_price);
		// }

		// document.getElementById("day_low").onmouseover = function() {mouseOver_low()};
		// document.getElementById("day_low").onmouseout = function() {mouseOut_low()};

		// function mouseOver_low() {
		//   last_price = full_data[2];
		//   console.log(last_price);
		// }

		// function mouseOut_low() {
		//   last_price = full_data[0];
		//   console.log(last_price);
		// }



    var database = [
      {name:'MoneyMan ',numbits:14.72303252 ,sumpaid:1000000 ,date:'Nov. 9, 2021' ,pricebought:67920.7900031182 ,transaction:'paid an advance'},
      {name:'OBJ ',numbits:11.7 ,sumpaid:750000 ,date:'Nov. 12, 2021' ,pricebought:64102.5641025641 ,transaction:'entire salary'},
      {name:'Mayor Eric Adams ',numbits:0.22504532334 ,sumpaid:8850 ,date:'Jan. 21, Feb. 4, and Feb. 18, 2021' ,pricebought:39325.4117377474 ,transaction:'Paid first 3 checks'},
      {name:'50 Cent ',numbits:700 ,sumpaid:460000 ,date:'Jun. 2014' ,pricebought:657.142857142857 ,transaction:'accepted payments for his fifth album “Animal Ambition”'},
      {name:'Russell Okung ',numbits:240 ,sumpaid:6500000 ,date:'Dec. 2020' ,pricebought:27083.3333333333 ,transaction:'converted his salary'},
      {name:'Francis Ngannou ',numbits:10.5577207486 ,sumpaid:375000 ,date:'Jan. 22, 2022' ,pricebought:35519.0299998915 ,transaction:'paid half of his salary'},
      {name:'Cade Cunningham ',numbits:452.965337233 ,sumpaid:20602920 ,date:'Aug. 19, 2021' ,pricebought:45484.5400000268 ,transaction:'signing bonus '},
      {name:'Trevor Lawrence ',numbits:749.747337749 ,sumpaid:22630055 ,date:'Jul. 20, 2021' ,pricebought:30183.5750000036 ,transaction:'signing bonus '},
      {name:'Aaron Rodgers ',numbits:16.3781143189 ,sumpaid:1000000 ,date:'Nov. 1, 2021' ,pricebought:61057.0900000387 ,transaction:'Giveaway'},
      {name:'Gwyneth Paltrow ',numbits:10.4167003039 ,sumpaid:500000 ,date:'Dec. 21, 2021' ,pricebought:47999.8450001293 ,transaction:'Giveaway'}
    ];

    database.forEach(dict=> {

          currentvalue = Number(((dict['numbits'] * last_price_load)))
          plsum=Number(((currentvalue -  dict['sumpaid'])))
          plpercent=Number(((plsum / dict['sumpaid']) * 100))

          currentvalue = Math.round(100*currentvalue)/100;
    			plsum = Math.round(100*plsum)/100;		
    			plpercent = Math.round(100*plpercent)/100;

					if (Number(plsum) > 0 ){

						pl_value = "$"+plsum.toLocaleString("en-US") 
					}

					if (Number(plsum) < 0 ){

						plsum = String(plsum).replace("-", "");

						plsum = Number(plsum).toLocaleString("en-US");


		      	pl_value = "-$"+plsum 

					}

		      difference_in_price = Number(last_price_load) - Math.round(dict['pricebought']);

					if (Number(difference_in_price) > 0 ){
						plus_minus = "+"
					}

					if (Number(difference_in_price) < 0 ){
						plus_minus="-"
					}

		      pl_percent_str= '('+plpercent+"%"+')';
          // $("[name='pl_percent']").text(pl_percent_str);

					difference_in_price = plus_minus +'$'+ Math.abs(difference_in_price).toLocaleString("en-US", {
							        minimumFractionDigits: 2,
							        maximumFractionDigits: 2
							    });
          var table = document.getElementById("stat_table");


          var row = table.insertRow();


          var cell1 = row.insertCell();
          var cell2 = row.insertCell();
          var cell3 = row.insertCell();
          var cell4 = row.insertCell();
          var cell5 = row.insertCell();
          var cell6 = row.insertCell();
          var cell7 = row.insertCell();
          // var cell8 = row.insertCell();

          // pl_num = "$"+plsum.toLocaleString("en-US") +'  ('+plpercent+"%"+')';
          // pl_num = pl_num.replace("$-", "-$");




		      cell1.innerHTML = dict['name'];
		      cell2.innerHTML = dict['numbits'];
		       // + "<p align=right> <img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1920px-Bitcoin.svg.png\" width=\"15px\" height=\"5px\"></p>";

		      cell3.innerHTML = "$"+dict['sumpaid'].toLocaleString("en-US");
		      // + "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1920px-Bitcoin.svg.png\" width=\"20px\" height=\"20px\">";
		      cell4.innerHTML = "$"+currentvalue.toLocaleString("en-US");
  				cell5.innerHTML = pl_value + "<span class='yo'>" +'('+plpercent+"%"+')'+ "</span>";
          // cell6.innerHTML = plpercent+"%";
          cell6.innerHTML = "$"+Math.round(dict['pricebought']).toLocaleString("en-US") + "<span class='yo'>" + '('+difference_in_price+')' + "</span>";
		      cell7.innerHTML = dict['date'];


  
      
    })
})



var intervalId = window.setInterval(function(){


	$.get('last_price_file', function(response) {
		// console.log(response);
		full_data_new = response.split("\n");
    last_price_new = full_data_new[0];
    day_high_new = full_data_new[1];
    day_low_new = full_data_new[2];



		// console.log(response.last);

		// document.getElementById("day_high").onmouseover = function() {mouseOver_high()};
		// document.getElementById("day_high").onmouseout = function() {mouseOut_high()};

		// function mouseOver_high() {
		//   last_price = full_data[1];
		//   console.log(last_price);
		// }

		// function mouseOut_high() {
		//   last_price = full_data[0];
		//   console.log(last_price);
		// }

		// document.getElementById("day_low").onmouseover = function() {mouseOver_low()};
		// document.getElementById("day_low").onmouseout = function() {mouseOut_low()};

		// function mouseOver_low() {
		//   last_price = full_data[2];
		//   console.log(last_price);
		// }

		// function mouseOut_low() {
		//   last_price = full_data[0];
		//   console.log(last_price);
		// }

		

    var database = [
      {name:'MoneyMan ',numbits:14.72303252 ,sumpaid:1000000 ,date:'Nov. 9, 2021' ,pricebought:67920.7900031182 ,transaction:'paid an advance'},
      {name:'OBJ ',numbits:11.7 ,sumpaid:750000 ,date:'Nov. 12, 2021' ,pricebought:64102.5641025641 ,transaction:'entire salary'},
      {name:'Mayor Eric Adams ',numbits:0.22504532334 ,sumpaid:8850 ,date:'Jan. 21, Feb. 4, and Feb. 18, 2021' ,pricebought:39325.4117377474 ,transaction:'Paid first 3 checks'},
      {name:'50 Cent ',numbits:700 ,sumpaid:460000 ,date:'Jun. 2014' ,pricebought:657.142857142857 ,transaction:'accepted payments for his fifth album “Animal Ambition”'},
      {name:'Russell Okung ',numbits:240 ,sumpaid:6500000 ,date:'Dec. 2020' ,pricebought:27083.3333333333 ,transaction:'converted his salary'},
      {name:'Francis Ngannou ',numbits:10.5577207486 ,sumpaid:375000 ,date:'Jan. 22, 2022' ,pricebought:35519.0299998915 ,transaction:'paid half of his salary'},
      {name:'Cade Cunningham ',numbits:452.965337233 ,sumpaid:20602920 ,date:'Aug. 19, 2021' ,pricebought:45484.5400000268 ,transaction:'signing bonus '},
      {name:'Trevor Lawrence ',numbits:749.747337749 ,sumpaid:22630055 ,date:'Jul. 20, 2021' ,pricebought:30183.5750000036 ,transaction:'signing bonus '},
      {name:'Aaron Rodgers ',numbits:16.3781143189 ,sumpaid:1000000 ,date:'Nov. 1, 2021' ,pricebought:61057.0900000387 ,transaction:'Giveaway'},
      {name:'Gwyneth Paltrow ',numbits:10.4167003039 ,sumpaid:500000 ,date:'Dec. 21, 2021' ,pricebought:47999.8450001293 ,transaction:'Giveaway'}
    ];

		// try {
		// 	last_price_new = price_list.slice(-1);
		// 	console.log(price_list.slice(-1));
		// } 
		// catch  {
		// 	console.log('no way');
		// }

		last_price_item = Number(last_price_new).toLocaleString("en-US")
		day_high_item = Number(day_high_new).toLocaleString("en-US")
		day_low_item = Number(day_low_new).toLocaleString("en-US")

		$("[name='last_price']").text(last_price_item);
		$("[id='day_high']").text(day_high_item);
		$("[id='day_low']").text(day_low_item);


		if (price_list.slice(-1) == '') {
			last_price_new = full_data_new[0];
		} else {
			last_price_new = price_list.slice(-1)
		}


    row_count = 0


		database.forEach(dict=> {

          currentvalue = Number(((dict['numbits'] * last_price_new)))
          plsum=Number(((currentvalue -  dict['sumpaid'])))
          plpercent=Number(((plsum / dict['sumpaid']) * 100))
          
          currentvalue = Math.round(100*currentvalue)/100;
    			plsum = Math.round(100*plsum)/100;		
    			plpercent = Math.round(100*plpercent)/100;

					if (Number(plsum) > 0 ){

						pl_value = "$"+plsum.toLocaleString("en-US") 
					}

					if (Number(plsum) < 0 ){

						plsum = String(plsum).replace("-", "");

						plsum = Number(plsum).toLocaleString("en-US");


		      	pl_value = "-$"+plsum 

					}


					if (Number(currentvalue) < Number(dict['sumpaid'])) {
						lp="loss"
						ml='lost '
					}
					if (Number(currentvalue) > Number(dict['sumpaid'])){
						lp="profit"
						ml='made '
					}

		      row_count=1

		      difference_in_price = Number(last_price_new) - Math.round(dict['pricebought']);

					if (Number(difference_in_price) > 0 ){
						plus_minus = "+"
					}

					if (Number(difference_in_price) < 0 ){
						plus_minus="-"
					}

					pl_percent_str='('+plpercent+"%"+')';
          // $("[id='pl_percent']").text(pl_percent_str);

					difference_in_price = plus_minus +'$'+ Math.abs(difference_in_price).toLocaleString("en-US", {
							        minimumFractionDigits: 2,
							        maximumFractionDigits: 2
							    });

		      var table = document.getElementById("stat_table");

		      $("table tr:eq("+row_count+")").remove()


		      var row = table.insertRow();




		      var cell1 = row.insertCell();
		      var cell2 = row.insertCell();
		      var cell3 = row.insertCell();
		      var cell4 = row.insertCell();
		      var cell5 = row.insertCell();
		      var cell6 = row.insertCell();
		      var cell7 = row.insertCell();
		      // var cell8 = row.insertCell();




		      cell1.innerHTML = dict['name'];
		      cell2.innerHTML = dict['numbits'];
		       // + "<p align=right> <img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1920px-Bitcoin.svg.png\" width=\"15px\" height=\"5px\"></p>";

		      cell3.innerHTML = "$"+dict['sumpaid'].toLocaleString("en-US");
		      // + "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1920px-Bitcoin.svg.png\" width=\"20px\" height=\"20px\">";
		      cell4.innerHTML = "$"+currentvalue.toLocaleString("en-US");
  				cell5.innerHTML = pl_value + "<span class='yo'>" +'('+plpercent+"%"+')'+ "</span>";
          // cell6.innerHTML = plpercent+"%";
          cell6.innerHTML = "$"+Math.round(dict['pricebought']).toLocaleString("en-US") + "<span class='yo'>" + '('+difference_in_price+')' + "</span>";
		      cell7.innerHTML = dict['date'];


	
			
		})


	});


  
}, 50);
$(document).ready(function(){
	// console.log('jquery ran');


});

function myFunction() {
    var x = document.getElementById("myText").value;
    selectElement = document.querySelector('#span');
    output = selectElement.value;
  


    if (output =='1m' ){
    	idk=5500
    }
    if (output =='3m' ){
    	idk=7500
    }
    if (output =='6m' ){
    	idk=12500
    }
    if (output =='9m' ){
    	idk=15550
    }
    if (output =='1y' ){
    	idk=20000
    }
    newvalue = Number(Math.round((x * idk)*100)/100);

    percent=((newvalue-x)/x)*100

    if (newvalue < x){
    	status='loss'
    }
    if (newvalue > x){
    	status='gain'
    }

    glsentence=" This is a "+percent+"% "+status+"."

    printedvalue="$"+newvalue+'.'+glsentence
    document.getElementById("yikes").innerHTML = printedvalue;
    //document.querySelector('.output').textContent = output;
}



	window.onload = function(){ 

			
			$.get('last_price_file', function(response) {

			  // console.log(response);
		   //  full_data_hover = response.split("\n");
		   //  last_price_hover = full_data_hover[0];
		   //  day_high_hover = full_data_hover[1];
		   //  day_low_hover = full_data_hover[2];


				function new_rows() {

				    var database = [
				      {name:'MoneyMan ',numbits:14.72303252 ,sumpaid:1000000 ,date:'Nov. 9, 2021' ,pricebought:67920.7900031182 ,transaction:'paid an advance'},
				      {name:'OBJ ',numbits:11.7 ,sumpaid:750000 ,date:'Nov. 12, 2021' ,pricebought:64102.5641025641 ,transaction:'entire salary'},
				      {name:'Mayor Eric Adams ',numbits:0.22504532334 ,sumpaid:8850 ,date:'Jan. 21, Feb. 4, and Feb. 18, 2021' ,pricebought:39325.4117377474 ,transaction:'Paid first 3 checks'},
				      {name:'50 Cent ',numbits:700 ,sumpaid:460000 ,date:'Jun. 2014' ,pricebought:657.142857142857 ,transaction:'accepted payments for his fifth album “Animal Ambition”'},
				      {name:'Russell Okung ',numbits:240 ,sumpaid:6500000 ,date:'Dec. 2020' ,pricebought:27083.3333333333 ,transaction:'converted his salary'},
				      {name:'Francis Ngannou ',numbits:10.5577207486 ,sumpaid:375000 ,date:'Jan. 22, 2022' ,pricebought:35519.0299998915 ,transaction:'paid half of his salary'},
				      {name:'Cade Cunningham ',numbits:452.965337233 ,sumpaid:20602920 ,date:'Aug. 19, 2021' ,pricebought:45484.5400000268 ,transaction:'signing bonus '},
				      {name:'Trevor Lawrence ',numbits:749.747337749 ,sumpaid:22630055 ,date:'Jul. 20, 2021' ,pricebought:30183.5750000036 ,transaction:'signing bonus '},
				      {name:'Aaron Rodgers ',numbits:16.3781143189 ,sumpaid:1000000 ,date:'Nov. 1, 2021' ,pricebought:61057.0900000387 ,transaction:'Giveaway'},
				      {name:'Gwyneth Paltrow ',numbits:10.4167003039 ,sumpaid:500000 ,date:'Dec. 21, 2021' ,pricebought:47999.8450001293 ,transaction:'Giveaway'}
				    ];

				    database.forEach(dict=> {

				          currentvalue = Number(((dict['numbits'] * last_price_num)))
				          plsum=Number(((currentvalue -  dict['sumpaid'])))
				          plpercent=Number(((plsum / dict['sumpaid']) * 100))

				          currentvalue = Math.round(100*currentvalue)/100;
				    			plsum = Math.round(100*plsum)/100;		
				    			plpercent = Math.round(100*plpercent)/100;

									if (Number(plsum) > 0 ){

										pl_value = "$"+plsum.toLocaleString("en-US") 
									}

									if (Number(plsum) < 0 ){

										plsum = String(plsum).replace("-", "");

										plsum = Number(plsum).toLocaleString("en-US");


						      	pl_value = "-$"+plsum 

									}

		      				row_count=1

						      difference_in_price = Number(last_price_num) - Math.round(dict['pricebought']);

									if (Number(difference_in_price) > 0 ){
										plus_minus = "+"
									}

									if (Number(difference_in_price) < 0 ){
										plus_minus="-"
									}

							    // pl_percent_str='('+plpercent+"%"+')';
				          // $("[name='pl_percent']").text(pl_percent_str);

									difference_in_price = plus_minus +'$'+ Math.abs(difference_in_price).toLocaleString("en-US", {
							        minimumFractionDigits: 2,
							        maximumFractionDigits: 2
							    });

				          var table = document.getElementById("stat_table");

		      				$("table tr:eq("+row_count+")").remove()

				          var row = table.insertRow();


				          var cell1 = row.insertCell();
				          var cell2 = row.insertCell();
				          var cell3 = row.insertCell();
				          var cell4 = row.insertCell();
				          var cell5 = row.insertCell();
				          var cell6 = row.insertCell();
				          var cell7 = row.insertCell();
				          // var cell8 = row.insertCell();




						      cell1.innerHTML = dict['name'];
						      cell2.innerHTML = dict['numbits'];
						       // + "<p align=right> <img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1920px-Bitcoin.svg.png\" width=\"15px\" height=\"5px\"></p>";

						      cell3.innerHTML = "$"+dict['sumpaid'].toLocaleString("en-US");
						      // + "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1920px-Bitcoin.svg.png\" width=\"20px\" height=\"20px\">";
						      cell4.innerHTML = "$"+currentvalue.toLocaleString("en-US");
		      				cell5.innerHTML = pl_value + "<span class='yo'>" +'('+plpercent+"%"+')'+ "</span>";
				          // cell6.innerHTML = plpercent+"%";
				          cell6.innerHTML = "$"+Math.round(dict['pricebought']).toLocaleString("en-US") + "<span class='yo'>" + '('+difference_in_price+')' + "</span>";
						      cell7.innerHTML = dict['date'];


				  
				      
				    })
				}

				document.getElementById("days_high").onmouseover = function() {mouseOver_high()};
				document.getElementById("days_high").onmouseout = function() {mouseOut_high()};


				function mouseOver_high() {
				  last_price_num = day_high_new;

				  price_list.push(last_price_num);
				  // console.log(price_list);



				  new_rows()
				  // console.log(last_price_num);
				}

				function mouseOut_high() {
				  last_price_num = last_price_new;

				  price_list = [];
				  // console.log(price_list);				  
				  
				  new_rows()
				  // console.log(last_price_num);
				}

				document.getElementById("days_low").onmouseover = function() {mouseOver_low()};
				document.getElementById("days_low").onmouseout = function() {mouseOut_low()};

				function mouseOver_low() {			
				  last_price_num = day_low_new;

				  price_list.push(last_price_num);
				  // console.log(price_list);				  
				  
				  new_rows()
				  // console.log(last_price_num);
				}

				function mouseOut_low() {				
				  last_price_num = last_price_new;

				  price_list = [];
				  // console.log(price_list);				  
				  
				  new_rows()
				  // console.log(last_price_num);
				}
			})
	};
