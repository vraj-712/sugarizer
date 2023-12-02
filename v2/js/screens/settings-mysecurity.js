/* @ MySecurity
 @desc This is the subcomponent of the settings component */

const MySecurity = {
	name: 'MySecurity',
	template: ` 
				<dialog-box 
						ref="mysecurityModal"
						iconData="./icons/login-icon.svg"
						isNative="true"
						:titleData="SugarL10n ? SugarL10n.get('MySecurity') : ''"
						cancel-button="true"
						v-on:on-cancel="close('mysecurityModal')"
				>
					<div class="computer-content" >
						<div v-if="step === 0">
							<div class="security-message" >{{SugarL10n ? SugarL10n.get('SecurityMessage') : ''}}</div>
							<password-box class="security-password" ref="password" @passwordSet="login"/>
							<icon-button 
								id="next-btn"
								svgfile="./icons/go-right.svg"
								class="security-rightbutton"
								size="28"
								color="1024"
								x="0"
								y="0"
								:text="SugarL10n ? SugarL10n.get('Next') : ''"
								@click="login"
							></icon-button>
							<div class="security-warning" v-if="warning.show">
								{{ warning.text }}
							</div>
						</div>
						<div v-if="step === 1">
							<div class="security-message" >{{SugarL10n ? SugarL10n.get('SecurityMessageNew', {"min": 4}) : ''}}</div>
							<password-box class="security-password" ref="newpassword" @passwordSet="updatePassword"/>
							<icon-button 
								id="next-btn"
								svgfile="./icons/go-right.svg"
								class="security-rightbutton"
								size="28"
								color="1024"
								x="0"
								y="0"
								:text="SugarL10n ? SugarL10n.get('Done') : ''"
								@click="updatePassword"
							></icon-button>
						</div>
						<div v-if="step === 2">
							<div class="security-message" >{{SugarL10n ? SugarL10n.get('SecurityMessageDone') : ''}}</div>
						</div>
					</div>			
				</dialog-box> 
	`,
	components: {
		'dialog-box': Dialog,
		'password-box': Password,
		'icon-button': IconButton,
	},

	props: ['SugarL10n', 'username'],

	emits: ['close'],

	data() {
		return {
			warning: {
				show: false,
				text: "xxx"
			},
			step: 0,
		}
	},

	mounted() {
		// Hack to focus on password field initially
		setInterval(() => {
			if (this.$refs.password) {
				this.$refs.password.$refs.password.focus();
				clearInterval();
			}
		}, 1000);
	},

	methods: {

		close(ref) {
			this.$refs[ref].showDialog = false;
			this.$emit('close', null);
		},

		openModal(ref) {
			this.$refs[ref].showDialog = true;
		},

		login() {
			const password = this.$refs.password.passwordText;

			const loginData = {
				"name": `${this.username}`,
				"password": `${password}`,
			}
			axios.post(`/auth/login`, { user: JSON.stringify(loginData) }, {
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then((response) => {
				if (response.status == 200) {
					const data = {
						"token": {
							"x_key": response.data.user._id,
							"access_token": response.data.token,
						},
					}
					localStorage.setItem('sugar_settings', JSON.stringify(data));

					this.step++;

					this.$nextTick(() => {
						this.$refs.newpassword.$refs.password.focus();
					});
				}
			}).catch((error) => {
				if (error.response && error.response.status === 401) {
					console.log(error.response.data);
					this.warning.show = true;
					this.warning.text = this.SugarL10n ? this.SugarL10n.get('InvalidPassword') : "Invalid Password";
				} else {
					console.log(error);
				}
			});
		},

		updatePassword() {
			const token = JSON.parse(localStorage.getItem("sugar_settings")).token;
			const password = this.$refs.newpassword.passwordText;

			if (password.length < 4) {
				return;
			}

			axios.put(`/api/v1/users/${token.x_key}`, { "user": JSON.stringify({ password: password }), }, {
				headers: {
					'x-key': token.x_key,
					'x-access-token': token.access_token,
				}
			}).then((response) => {
				if (response.status == 200) {
					this.step++;
				}
			}).catch((error) => {
				if (error.response && error.response.status === 401) {
					console.log(error.response.data);
					this.warning.show = true;
					this.warning.text = this.SugarL10n ? this.SugarL10n.get('InvalidPassword') : "Invalid Password";
				} else {
					console.log(error);
				}
			});
		},

		onContributorsLinkClick() {
			window.open(this.constant.contributorslink, '_blank');
		}
	}

};

if (typeof module !== 'undefined') module.exports = { MySecurity }