function displayMenu() {
	var menu = document.getElementById("card-menu");

	if (menu.className  == "menu-cerrado") {
		menu.className = "menu-abierto"
	} else {
		menu.className = "menu-cerrado"
	}

}

$(document).ready(function(){
	$(".close-menu").click(function () {
			$('.icon-menu').click();
	});
});