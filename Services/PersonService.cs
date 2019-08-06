using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Infrastructure;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.Services
{
    public class PersonService : ServiceBase
    {
        private PersonContext _personContext;

        public PersonService(PersonContext personContext)
        {
            _personContext = personContext;
        }

        public virtual Result<List<PersonModel>> Search(string term = null)
        {
            if (!string.IsNullOrEmpty(term))
            {
                term = term.ToLower();
                term = term.Trim();

                var result = 
                    _personContext.Persons
                    .Where(x =>
                        x.FirstName.ToLower().Contains(term) ||
                        x.LastName.ToLower().Contains(term)
                    )
                    .ToList();

                return Ok(result);
            }

            return Ok(_personContext.Persons.ToList());
        }

        public virtual Result<int> Add(PersonModel model)
        {
            if(model == null)
                return Error<int>();
            if(string.IsNullOrEmpty(model.FirstName))
                return Error<int>("First name not defined.");
            if(string.IsNullOrEmpty(model.LastName))
                return Error<int>("Last name not defined.");

            TrimStrings(model);

            var personExists =
                _personContext
                .Persons
                .Any(x =>
                    x.FirstName == model.FirstName &&
                    x.LastName == model.LastName
                    );
            if(personExists)
            {
                return Error<int>("Person with the same first name and last name already exists.");
            }

            var newId = _personContext.Persons.ToList().Max(x => x?.Id ?? 0) + 1;
            model.Id = newId;

            _personContext.Persons.Add(model);
            _personContext.SaveChanges();


            return Ok(model.Id);
        }
        
        public virtual Result Update(PersonModel model)
        {
            if (model == null)
                return Error();
            if (model.Id <= 0)
                return Error($"{model.Id} <= 0.");
            var person = _personContext.Persons.Where(x => x.Id == model.Id).FirstOrDefault();
            if (person == null)
                return Error($"Person with id = {model.Id} not found.");

            TrimStrings(model);

            var personExists =
                _personContext.Persons
                .Any(x =>
                    x.Id != model.Id &&
                    x.FirstName == model.FirstName &&
                    x.LastName == model.LastName
                    );
            if(personExists)
            {
                return Error("Person with the same first name and last name already exists.");
            }

            person.FirstName = model.FirstName;
            person.LastName = model.LastName;
            _personContext.SaveChanges();

            return Ok();
        }

        public virtual Result Delete(int id)
        {
            var unit = _personContext.Persons.Where(x => x.Id == id).FirstOrDefault();
            if (unit == null)
                return Error($"Can't find person with Id = {id}.");
            _personContext.Persons.Remove(unit);
            _personContext.SaveChanges();
            return Ok();
        }
        
        private static void TrimStrings(PersonModel model)
        {
            model.FirstName = model.FirstName.Trim();
            model.LastName = model.LastName.Trim();
        }
    }
}
