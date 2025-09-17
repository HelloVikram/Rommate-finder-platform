const endpoint=`http://localhost:3000`
const loginform=document.querySelector('#loginForm');

loginform.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
   try{
       const response=await axios.post(`${endpoint}/login`,{email,password});
       const token=response.data.token;
       localStorage.setItem('token',token);
       alert(response.data.message);
       window.location.href = "listings.html";
    }catch(err){
        if(err.response.status==404||err.response.status==401||err.response.status==500){
            alert(err.response.data.message);
        }
        console.log('Error in login frontend',err);
    }
})