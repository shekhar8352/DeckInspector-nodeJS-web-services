"use strict";
var express = require('express');
var router = express.Router();

const ErrorResponse = require('../model/error');
var ObjectId = require('mongodb').ObjectId;
const newErrorResponse = require('../model/newError');
const TenantService = require('../service/tenantService');


require("dotenv").config();


router.route('/add')
.post(async function (req,res){
try{
  var errResponse;
  // Get user input
  var { name,companyDescription, website,validity,allowedDiskSpace,allowedUsersCount,expenses} = req.body;

  // Validate user input
  if (name===undefined) {
    errResponse = new ErrorResponse(400,"Name is required","Mandatory field is missing");
    res.status(400).json(errResponse);
    return;
  }
  var registrationDate= (new Date(Date.now())).toISOString();

  var newTenant = {
      "name":name,
      "registrationDate":registrationDate,
      "companyDescription":companyDescription,    
      "website":website,
      "validity":validity===undefined?10:validity,
      "allowedDiskSpace":allowedDiskSpace===undefined?10:allowedDiskSpace,    
      "allowedUsersCount": allowedUsersCount===undefined?5:allowedUsersCount,
      "expenses": expenses===undefined?1000:expenses,
      "companyIdentifier":`${name.toLowerCase()}.ondeckinspectors.com`
  }


  var result = await TenantService.addTenant(newTenant);    
  if (result.reason) {
    return res.status(result.code).json(result);
  }
  if (result) {
    //console.debug(result);
    return res.status(201).json(result);
  }
}
catch (exception) {
  errResponse = new newErrorResponse(500, false, exception.message);
  return res.status(500).json(errResponse);
}
});
router.route('/:id')
.get(async function(req,res){
  try{
    var errResponse;
    const tenantId = req.params.id;
    var result = await TenantService.getTenantById( tenantId);
    if (result.reason) {
      return res.status(result.code).json(result);
    }
    if (result) {
      //console.debug(result);
      return res.status(201).json(result);
    }
  }
  catch (exception) {
    errResponse = new newErrorResponse(500, false, exception);
    return res.status(500).json(errResponse);
  }
})
router.route('/:id')
.put(async function(req,res){
  try{
    var errResponse;
    const updateData = req.body;
    const tenantId = req.params.id;
    if (updateData.name===undefined) {
      errResponse = new ErrorResponse(400,"Name is required","Mandatory field is missing");
      res.status(400).json(errResponse);
      return;
    }
    var newTenant = {
      "name": updateData.name,
      "companyDescription":updateData.companyDescription     
   }

    var result = await TenantService.editTenant(tenantId,newTenant);
    if (result.reason) {
      return res.status(result.code).json(result);
    }
    if (result) {
      //console.debug(result);
      return res.status(201).json(result);
    }
  }
  catch (exception) {
    errResponse = new newErrorResponse(500, false, exception);
    return res.status(500).json(errResponse);
  }
})
.delete(async function(req,res){
  try{
    var errResponse;
    const tenantId = req.params.id;
    var result = await TenantService.deleteTenantPermanently(tenantId);
    if (result.reason) {
      return res.status(result.code).json(result);
    }
    if (result) {
      //console.debug(result);
      return res.status(201).json(result);
    }
  }
  catch (exception) {
    errResponse = new newErrorResponse(500, false, exception);
    return res.status(500).json(errResponse);
  }
})

router.route('/:id/toggletenantstatus/:state')
    .post(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        const state = req.params.state;
        const isActive = state == 1 ? true : false;
        var result = await TenantService.toggleAccessForTenant(tenantId, isActive);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception);
        return res.status(500).json(errResponse);
      }
    });

router.route('/:id/updatevaliditydate')
.post(async function(req,res){
  try {
    var errResponse;
    const tenantId = req.params.id;
    const endDate = req.body;
    
    var result = await TenantService.updateValidityDate(tenantId, endDate);
    if (result.reason) {
      return res.status(result.code).json(result);
    }
    if (result) {
      return res.status(201).json(result);
    }
  }
  catch (exception) {
    errResponse = new newErrorResponse(500, false, exception);
    return res.status(500).json(errResponse);
  }
});

router.route('/:id/adddiskspace/:diskspace')
    .post(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        const diskspace = req.params.diskspace;
        
        var result = await TenantService.addDiskSpace(tenantId, diskspace);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception);
        return res.status(500).json(errResponse);
      }
    });
  router.route('/:id/increaseValidity/:validity')
    .post(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        const validity = req.params.validity;
        
        var result = await TenantService.increaseTenantValidity(tenantId, validity);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception);
        return res.status(500).json(errResponse);
      }
    });
  router.route('/:id/increasetenantusers/:count')
    .post(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        const count = req.params.count;
        
        var result = await TenantService.increaseTenantUsers(tenantId, count);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception);
        return res.status(500).json(errResponse);
      }
    });
    router.route('/:id/upserticons')
    .post(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        const iconsData = req.body;
        
        var result = await TenantService.updateAddIconsForTenant(tenantId, iconsData);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception);
        return res.status(500).json(errResponse);
      }
    });
   
router.route('/:id/updatestoragedatadetails/')
    .post(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        const azureStorageDetails = req.body;
        
        var result = await TenantService.updateTenantsAzureStorageDataDetails(tenantId, azureStorageDetails);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception.message);
        return res.status(500).json(errResponse);
      }
    });

  router.route('/:id/updatelogo')
    .post(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        const {url} = req.body;
        
        var result = await TenantService.updateLogoURL(tenantId, url);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception);
        return res.status(500).json(errResponse);
      }
    });
    router.route('/:id/updatewebsite')
    .post(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        const {website} = req.body;
        
        var result = await TenantService.updateTenantWebsite(tenantId, website);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception);
        return res.status(500).json(errResponse);
      }
    });
    router.route('/:id/updateexpenses')
    .post(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        const {expense} = req.body;
        
        var result = await TenantService.updateTenantExpenses(tenantId, expense);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception);
        return res.status(500).json(errResponse);
      }
    });
    router.route('/:id/addusedspace')
    .post(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        const {space} = req.body;
        
        var result = await TenantService.addUsedDiskSpace(tenantId, space);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception);
        return res.status(500).json(errResponse);
      }
    });
    router.route('/:id/diskwarning')
    .get(async function (req, res) {
      try {
        var errResponse;
        const tenantId = req.params.id;
        
        var result = await TenantService.getDiskWarning(tenantId);
        if (result.reason) {
          return res.status(result.code).json(result);
        }
        if (result) {
          return res.status(201).json(result);
        }
      }
      catch (exception) {
        errResponse = new newErrorResponse(500, false, exception);
        return res.status(500).json(errResponse);
      }
    });
module.exports = router ;