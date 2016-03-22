// defines some status-functions

$( document ).ready(function() {

   // check eth-address
   function isValidAddress(adr) {
      if (!adr) return false;
      if (adr.indexOf("0x")==0) adr=adr.substring(2);
      var pattern =  /[0-9a-fA-F]{40}/g;
      return pattern.test(adr) && adr.length==40;
   }
 
    
   $('#dao_account_adr').on('keyup',function() {
       this.setCustomValidity(isValidAddress($(this).val()) ? '' : 'a Account address has to have at least 40 digits (0-9,A-F)!');
   });
   $('#dao_account_form').submit(function(event){
		if(event.preventDefault) event.preventDefault(); 
		else event.returnValue = false;
      
      var thisForm 		= $('#dao_account_form'), error = 0;
			
				
		$(thisForm).find('.validate-required').each(function(){
			if($(this).val() === ''){
				$(this).addClass('field-error');
				error = 1;
			}else{
				$(this).removeClass('field-error');
			}
		});
		
		$(thisForm).find('.validate-email').each(function(){
			if(!isValidAddress($(this).val())){
				$(this).addClass('field-error');
				error = 1;
			}else{
				$(this).removeClass('field-error');
			}
		});


      if (error === 1) 
         return;
      

      // normalize eth-adr
      function normalizeAdr(adr, len) {
         if (adr.indexOf("0x")>=0) adr=adr.substring(2);
         while (adr.length< (len || 40)) adr="0"+adr; 
         return adr;
      }

      function round(val,len) {
         if (!val) return 0;
         len = len || 100;
         if (val<0.01) return val;
         return Math.round(val*len)/len;
      }

      function sendRequest (method,params,cb) {
         $.post("/web3/", JSON.stringify({
            jsonrpc:"2.0",
            method:method,
            params: params,
            id: parseInt(Math.random()*65535)
         }), function(data) {
            cb(data.result);
         });
      }
      
      var adr = $("#dao_account_adr").val();
      var stats = window.daoStats || { units:100};

      sendRequest("eth_getBalance",['0x'+normalizeAdr(adr),'latest'],function(balance) {
         sendRequest("eth_call",[{ to : window.daoStats.dao,  data : '0x70a08231'+ normalizeAdr(adr,64)},'latest'],function(tokens) {
            var web3 = new Web3();
            $("#dao_account_tokens").html(""+round((web3.fromWei(tokens,'ether') || 0)*100));
            $("#dao_account_balance").html(""+(round(web3.fromWei(balance,'ether')) || 0));
            $("#dao_account_result").show();
         });
      });

   });    
      
      
      
    
    
    
});



     

