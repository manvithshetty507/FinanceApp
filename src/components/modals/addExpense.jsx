import React from 'react'
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd'

function AddExpenseModal({ open, onCancel, onFinish}) {
    const [form] = Form.useForm()
  return (
    <Modal
        title="Add Expense"
        open={open}
        onCancel={onCancel}
        footer={null}
    >
        <Form
            form={form}
            layout='vertical'
            onFinish={(values) => {
                onFinish(values,"expense")
                form.resetFields()
            }}
        >
            <Form.Item 
                label="Name"
                name="name"
                rules={[
                    {required:true, message:"Please enter name"}
                ]}
            >
                <Input type='text' className='custom__input' />
            </Form.Item>

            <Form.Item 
                label="Amount"
                name="amount"
                rules={[
                    {required:true, message:"Please enter name"}
                ]}
            >
                <Input type='number' className='custom__input' />
            </Form.Item>

            <Form.Item
                label="Date"
                name="date"
                rules={[
                    {required:true, message:"Please select an income date !"}
                ]}
            >
                <DatePicker format="YYYY-MM-DD" className='custome__input' />
            </Form.Item>

            <Form.Item
                label="Tag"
                name="tag"
                rules={[
                    {required:true, message:"Please select an income date !"}
                ]}
            >
                <Select className='select__input'>
                    <Select.Option value="food">Food</Select.Option>
                    <Select.Option value="education">Education</Select.Option>
                    <Select.Option value="others">Others</Select.Option>

                </Select>
            </Form.Item>

            <Form.Item>
                <Button className="btn" type='primary' htmlType='submit' >Add Expense</Button>
            </Form.Item>
        </Form>
    </Modal>
  )
}

export default AddExpenseModal