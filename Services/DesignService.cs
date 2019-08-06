using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Infrastructure;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.Services
{
    public class DesignService : ServiceBase
    {
        private DesignContext _designContext;

        public DesignService(DesignContext designContext)
        {
            _designContext = designContext;
        }

        public virtual Result<List<DesignModel>> Search(string type = null)
        {
            if (!string.IsNullOrEmpty(type))
            {
                var result =
                    _designContext.Designs
                    .Where(x => x.Type == type)
                    .ToList();

                return Ok(result);
            }
            return Ok(_designContext.Designs.ToList());
        }

        public virtual Result<DesignModel> Get(string id)
        {
            return Ok(_designContext.Designs.Where(template => template.Id == id).First());
        }

        public virtual Result<string> Add(DesignModel model)
        {
            if (model == null)
                return Error<string>();

            model.Id = Guid.NewGuid().ToString();

            _designContext.Designs.Add(model);
            _designContext.SaveChanges();


            return Ok(model.Id);
        }

        public virtual Result UpdateRepresentative(string id, string filePath)
        {
            var design = _designContext.Designs.Where(x => x.Id == id).FirstOrDefault();
            if (design == null)
            {
                return Error($"Design with id = {id} not found.");
            }

            design.Representative = filePath;
            _designContext.SaveChanges();

            return Ok();
        }

        //public virtual Result Update(PersonModel model)
        //{
        //    if (model == null)
        //        return Error();
        //    if (model.Id <= 0)
        //        return Error($"{model.Id} <= 0.");
        //    var person = _personContext.Persons.Where(x => x.Id == model.Id).FirstOrDefault();
        //    if (person == null)
        //        return Error($"Person with id = {model.Id} not found.");

        //    TrimStrings(model);

        //    var personExists =
        //        _personContext.Persons
        //        .Any(x =>
        //            x.Id != model.Id &&
        //            x.FirstName == model.FirstName &&
        //            x.LastName == model.LastName
        //            );
        //    if (personExists)
        //    {
        //        return Error("Person with the same first name and last name already exists.");
        //    }

        //    person.FirstName = model.FirstName;
        //    person.LastName = model.LastName;
        //    _personContext.SaveChanges();

        //    return Ok();
        //}

        //public virtual Result Delete(int id)
        //{
        //    var unit = _personContext.Persons.Where(x => x.Id == id).FirstOrDefault();
        //    if (unit == null)
        //        return Error($"Can't find person with Id = {id}.");
        //    _personContext.Persons.Remove(unit);
        //    _personContext.SaveChanges();
        //    return Ok();
        //}

        //private static void TrimStrings(PersonModel model)
        //{
        //    model.FirstName = model.FirstName.Trim();
        //    model.LastName = model.LastName.Trim();
        //}
    }
}
