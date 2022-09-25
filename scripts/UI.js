const username = document.getElementById('username');
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const joinBtn = document.getElementById('join-btn');
const createBtn = document.getElementById('create-btn');
const copyBtn = document.getElementById('copy-btn');
const closeBtns = document.getElementsByClassName('close-btn');
const copyToClipboardBtn = document.getElementById('copy-clipboard-btn');

const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

toastr.options = {
	"closeButton": false,
	"debug": false,
	"newestOnTop": true,
	"progressBar": true,
	"positionClass": "toast-top-right",
	"preventDuplicates": false,
	"onclick": null,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "5000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
}

Array.from(document.getElementsByClassName('close-btn')).map(x => x.addEventListener('click', function() {
	this.parentNode.parentNode.classList.toggle('active');
}));

document.getElementById('login-btn').addEventListener('click', () => {
	if (username == "") return;
	
	myUsername = username.value;
	Network.login();
	
	loginScreen.style.display = "none";
	chatScreen.style.display = "flex";
});

document.getElementById("open-join-modal").addEventListener("click", () => {
	document.getElementById("join-modal").classList.toggle("active");
});

document.getElementById("open-create-modal").addEventListener("click", () => {
	document.getElementById("create-modal").classList.toggle("active");
});

joinBtn.addEventListener('click', () => {
	const id = document.getElementById('group-id');
	Network.joinGroup(id.value);
	id.value = "";
	document.getElementById("join-modal").classList.toggle("active");
});

createBtn.addEventListener('click', () => {
	const name = document.getElementById('group-name');
	const id = uid();
	Network.createGroup(id, name.value);
	name.value = "";
	document.getElementById("create-modal").classList.toggle("active");
});

copyBtn.addEventListener('click', () => {
	document.getElementById('copy-modal').classList.toggle('active');
});

copyToClipboardBtn.addEventListener('click', () => {
	document.getElementById('copyfield').style.background = '#3BA55D';
	copyToClipboardBtn.style.background = '#3BA55D';
	navigator.clipboard.writeText(currentGroup.id);

	setTimeout(() => {
		document.getElementById('copyfield').style.background = '#4752C4';
		copyToClipboardBtn.style.background = '#4752C4';
	}, 3000);
})

function updateGroups() {
	let html = '';
	const groupsList = document.getElementById('groups-list');
	Object.keys(groups).map(id => {
		html += `
			<a href="#" onclick="joinGroup('${id}')" id="group_${id}" class="group_id">
				<div class="group">
					<h3>${groups[id].name}</h3>
					<p>No message</p>
					<span>
						<i class="fas fa-minus"></i>
					</span>
				</div>
			</a>
		`;	
	});
	groupsList.innerHTML = html;
}

function joinGroup(id) {
	currentGroup = groups[id];
	Array.from(document.getElementsByClassName('group_id')).map(x => x.children[0].classList.remove('current_group'));
	document.getElementById(`group_${id}`).children[0].classList.add('current_group');
	
	document.getElementById('current_group_name').innerText = currentGroup.name;
	document.getElementById('link').value = currentGroup.id;
	document.getElementById('group-name-invite').innerText = currentGroup.name;
}

window.onbeforeunload = function() {
	Object.keys(groups).map(id => Network.leaveGroup(id));
}
