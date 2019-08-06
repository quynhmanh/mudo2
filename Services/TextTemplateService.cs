using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Infrastructure;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.Services
{
    public class TextTemplateService : ServiceBase
    {
        private TextTemplateContext _textTemplateContext;

        public TextTemplateService(TemplateContext textTemplateContext)
        {
            _textTemplateContext = textTemplateContext;
        }

        public virtual Result<int> Add(TextTemplateModel model)
        {
            if (model == null)
                return Error<int>();

            model.Id = Guid.NewGuid().ToString();

            _templateTextContext.Templates.Add(model);
            _templateContext.SaveChanges();


            return Ok(1);
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
