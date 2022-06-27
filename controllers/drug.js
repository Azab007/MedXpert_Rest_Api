const Drug = require('../models/Drug.js')
const { default: mongoose } = require('mongoose');

const vision = require('@google-cloud/vision');
const request = require('request');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../errors')
const { StatusCodes } = require('http-status-codes');


const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'dataset.csv',
    header: [
        { id: 'imgPath', title: 'ImgPath' },
        { id: 'vertices', title: 'Vertices' },
        { id: 'label', title: 'Label' }
    ]
});


const createDrug = async(req, res) => {
    const pharma_id = req.user.userId;
    const { inc_id, ...others } = req.body;
    try {
        const newDrug = new Drug({
            ...others,
            Inc_id: pharma_id

        });

        await newDrug.save();
        res.status(StatusCodes.CREATED).json({ "data": newDrug, "msg": "Drug is created successfully" });
    } catch (error) {
        throw new BadRequestError(error.message)
    }


}

const getDrugNames = async(req, res) => {
    if (!req.query.name) {
        throw new BadRequestError("pls enter the drug name");
    }
    const regex = new RegExp(req.query.name, 'i');
    var drugNames = await Drug.find({ drugName: regex }, { "drugName": 1 }).limit(5);
    res.status(StatusCodes.OK).json({ "data": drugNames, "msg": "success" })
}

const getDrug = async(req, res) => {
    const drug_id = req.query.id;
    const drug = await Drug.findById(drug_id);
    if (!drug) {
        throw new NotFoundError("Drug Not Found");
    }
    res.status(StatusCodes.OK).json({ "data": drug, "msg": "sucess" });

}


const getAllDrugs = async(req, res) => {
    const drugs = await Drug.find({});
    if (!drugs.length) {
        throw new NotFoundError('no drugs in database')
    }
    res.status(StatusCodes.OK).json({ "data": drugs, "msg": "success" });

}

const updateDrug = async(req, res) => {
    const drug_id = req.query.id;
    const { interactions, restrictions, _id, ...others } = req.body
    const drugFromDB = await Drug.findById(drug_id);
    if (!drugFromDB) {
        throw new NotFoundError("no drug matches this id")
    }

    if (req.user.userId !== drugFromDB.Inc_id.toString()) {
        throw new UnauthorizedError("you can update only your drugs")
    }

    const drug = await Drug.findByIdAndUpdate(drug_id, {
        $set: others
    }, {
        runValidators: true,
        new: true
    });


    res.status(StatusCodes.OK).json({
        "data": drug,
        "msg": "the Drug is updated succesfully"
    });
};


const deleteDrug = async(req, res) => {

    const drug_id = req.query.id;
    const drugFromDB = await Drug.findById(drug_id);

    if (!drugFromDB) {
        throw new NotFoundError("no drug matches this id")
    }

    if (req.user.userId !== drugFromDB.Inc_id.toString()) {
        throw new UnauthorizedError("you can delete only your drugs")
    }
    await drugFromDB.deleteOne();
    res.status(StatusCodes.OK).json({ msg: "the Drug is deleted succesfully" });



}


const addToList = async(req, res) => {

    const drug_id = req.query.id;
    const { interactions, restrictions } = req.body
    const drugFromDB = await Drug.findById(drug_id);
    if (!drugFromDB) {
        throw new NotFoundError("no drug matches this id")
    }

    if (req.user.userId !== drugFromDB.Inc_id.toString()) {
        throw new UnauthorizedError("you can add only to your lists")
    }
    const newData = await Drug.findByIdAndUpdate(drug_id, {
        $addToSet: {
            interactions,
            restrictions
        }
    }, {
        runValidators: true,
        new: true
    });

    res.status(StatusCodes.OK).json({
        "data": newData,
        msg: "the data is added succesfully"
    });

}


const deleteFromList = async(req, res) => {

    const id = req.query.id;
    const drugFromDB = await Drug.findById(drug_id);
    if (!drugFromDB) {
        throw new NotFoundError("no drug matches this id")
    }



    if (req.user.userId !== drugFromDB.Inc_id.toString()) {
        throw new UnauthorizedError("you can delete only from your lists")
    }
    const {
        interactions: {
            drug_id = null
        } = {
            drug_id: null
        },
        restrictions: {
            condition_name = "null"
        } = {
            condition_name: "null"
        }
    } = req.body
    const newData = await Drug.findByIdAndUpdate(id, { $pull: { interactions: { "drug_id": drug_id }, restrictions: { "condition_name": condition_name } }, }, { runValidators: true, new: true });
    res.status(StatusCodes.OK).json({ "data": newData, msg: "the data is deleted succesfully" });
}

const autoComplete = (req, res) => {
    let key = req.query.key;
    const output = [];
    let query = {
        "drugName": { "$regex": key, "$options": "i" }
    };
    Drug.find(query).limit(6).then(drugs => {
        if (drugs && drugs.length && drugs.length > 0) {
            drugs.forEach(drug => {
                output.push({ id: drug._id, name: drug.drugName })
            })
        }
        console.log(output);
        res.status(StatusCodes.OK).json({ "data": output })

    }).catch(err => {
        throw new BadRequestError("something went wrong");
    })

};


const scan = async(req, res) => {
    const file = req.file;
    const client = new vision.ImageAnnotatorClient();

    const fileName = file.path;
    const english = /^[A-Za-z0-9]*$/;
    // Read a local image as a text document
    const [result] = await client.documentTextDetection(fileName);
    const textAnnotations = result.textAnnotations
    const fullTextAnnotation = textAnnotations.filter((data, indx) => indx && english.test(data.description));


    let finalDAta = []


    for (const data of fullTextAnnotation) {
        // response = await match(data.description.toLowerCase())
        response = [data.description.toLowerCase()]
        if (response.length) {
            finalDAta.push({ "vertices": data.boundingPoly.vertices, "names": response })
        }

    }
    res.status(StatusCodes.OK).json({ imgName: file.filename, "data": finalDAta });
};


const match = (name) => {
    return new Promise(resolve => {
        var options = {
            'method': 'POST',
            'url': 'http://127.0.0.1:5000/matcher/',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": name
            })

        };
        request(options, function(error, response) {
            if (error) throw new Error(error);
            const ret = JSON.parse(response.body).data.map(x => x[1])
                // console.log(ret)
            resolve(ret)
        });
    })

}


const saveToDataset = (req, res) => {
    const { imgName, vertices, label } = req.body;
    let v = ""
    vertices.forEach(o => {
        for (let key in o) {
            v = v + o[key] + ", "
        }
    })
    const data = [{
        imgPath: `uploads/${imgName}`,
        vertices: v,
        label: label,
    }]

    csvWriter
        .writeRecords(data)

    res.status(StatusCodes.OK).json({ msg: "success" })
}


module.exports = {
    createDrug,
    getDrug,
    getAllDrugs,
    updateDrug,
    deleteDrug,
    addToList,
    deleteFromList,
    getDrugNames,
    autoComplete,
    scan,
    saveToDataset
};